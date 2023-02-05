.PHONY: app-init app-build app-dev

app-init:
	cd app && npm i
	cd ..

app-build:
	cd app && npx vite build --emptyOutDir
	cd ..

app-dev:
	cd app && npx vite dev
	cd ..