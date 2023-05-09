.PHONY: app-init app-build app-dev init up

app-init:
	cd app && npm i
	cd ..

app-build:
	cd app && npx vite build --emptyOutDir
	cd ..

app-dev:
	cd app && npx vite dev
	cd ..

server-init:
	npm i

init: server-init app-init app-build

up:
	@node index.js
