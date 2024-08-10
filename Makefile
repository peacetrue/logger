install:
	npm install -D jest
	npm install -D @babel/preset-typescript
	npm install dotenv --save
link:
	npm link
	pnpm link --global
links:
	npm ls -g --depth=0 --link
build:
	tsdx build --entry src/index.ts --entry src/config-setup.ts
