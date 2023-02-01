const express = require("express");
const knex = require("knex");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const https = require('https');
const selfsigned = require('selfsigned');
const app = express();

const cacheDirectory = path.join(__dirname, 'node_modules/.cache/xdrip-vis');
const certCacheFile = path.join(cacheDirectory, 'pems.json');

let db;

const useDb = (filename) => {
  db = knex({
    client: "sqlite3",
    connection: {
      filename
    },
    useNullAsDefault: true,
  });
}

useDb("export.sqlite")

app.use(express.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./");
  },
  filename: function (req, file, cb) {
    cb(null, "export.sqlite");
  },
});

const upload = multer({ storage: storage });

// Serve static files from the ./public directory
app.use(express.static('./public'));

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`);
});

const genericRoute = (req, res, table) => {
  let { start, end } = req.query;
  let conditions = [];
  if (start) conditions.push(["timestamp", ">=", start]);
  if (end) conditions.push(["timestamp", "<=", end]);
  if (conditions.length === 0) {
    db(table).select("").then((rows) => {
      res.json({ [table]: rows });
    });
  } else {
    let query = db(table).select("")
    conditions.forEach(([column, comparator, value]) => {
      query = query.where(column, comparator, value);
    });
    query.then((rows) => {
      res.json({ [table]: rows });
    });
  }
};

app.get("/bloodtest", (req, res) => {
  genericRoute(req, res, "BloodTest");
});

app.get("/bgreadings", (req, res) => {
  genericRoute(req, res, "BgReadings");
});

app.get("/treatments", (req, res) => {
  genericRoute(req, res, "Treatments");
});

app.post("/upload", upload.single("export"), (req, res) => {
  useDb("export.sqlite")
  res.json({ message: "DB file replaced" });
});

const savePems = (pems) => {
  if (!fs.existsSync(cacheDirectory)) {
    fs.mkdirSync(cacheDirectory, { recursive: true });
  }
  fs.writeFileSync(certCacheFile, JSON.stringify(pems));
};

const loadPems = () => {
  if (!fs.existsSync(certCacheFile)) {
    return undefined;
  }

  console.log(`Loading certificate from ${certCacheFile}`)
  let pems;
  try {
    pems = JSON.parse(fs.readFileSync(certCacheFile));
  } catch (e) {
    console.error(e);
    return undefined;
  }

  const { cert } = pems;

  const { X509Certificate } = require('crypto');
  const { validTo } = new X509Certificate(cert);

  const currentDate = new Date();
  const certExpiration = new Date(validTo);
  const isExpired = certExpiration <= currentDate;

  if (isExpired) {
    console.log(`${certCacheFile} is expired: validTo=${certExpiration.toISOString()}`)
    fs.unlinkSync(certCacheFile);
    return undefined;
  }

  return pems;
};

let pems = loadPems();
if (!pems) {
  console.log(`Generating certificate and saving it as ${certCacheFile}`)
  const attrs = [{ name: 'commonName', value: 'localhost' }];
  pems = selfsigned.generate(attrs, {
    keySize: 2048, // the size for the private key in bits (default: 1024)
    days: 30, // how long till expiry of the signed certificate (default: 365)
    algorithm: 'sha256', // sign the certificate with specified algorithm (default: 'sha1')
    extensions: [{ name: 'basicConstraints', cA: true }], // certificate extensions array
    pkcs7: false, // include PKCS#7 as part of the output (default: false)
  });
  savePems(pems)
}


const { private: key, cert } = pems;
const options = { key, cert }

const port = process.env.PORT || 3000;
https.createServer(options, app).listen(port, () => {
  console.log(`Server listening on port ${port}: https://localhost:${port}`);
});
