# 硬链接复用：ln -f $workingDir/learn-make/frontend.mk frontend.mk

# -------------------- link --------------------------------
link:
	npm link
unlink:
	npm unlink $(notdir $(shell pwd))
links:
	npm ls -g --depth=0 --link
ln-public:
	rm -rf public
	ln -s ../peacetrue-gojs/public public

install:
	npm install

# -------------------- components --------------------------------

link-env:
	npm link peacetrue-env
install-peacetrue-env:
	npm install peacetrue-env
install-dotenv:
	npm install dotenv --save-dev
install-dotenv-webpack:
	npm install dotenv-webpack --save-dev
install-dotenv-rollup:
	npm install rollup-plugin-dotenv --save-dev

# import "peacetrue-logger/config.setup"
link-logger:
	npm link peacetrue-logger
install-peacetrue-logger:
	npm install peacetrue-logger

link-fetch:
	npm link peacetrue-fetch
install-peacetrue-fetch:
	npm install peacetrue-fetch

link-peacetrue-yup:
	npm link peacetrue-yup
install-peacetrue-yup:
	npm install peacetrue-yup
install-yup:
	npm install yup
	npm i --save-dev @types/yup
install-yup-locales:
	npm install yup-locales

link-ra:
	npm link peacetrue-ra
install-peacetrue-ra:
	npm install peacetrue-ra
install-react-admin:
	npm install react-admin
install-ra-core:
	npm install ra-core
install-ra-ui-materialui:
	npm install ra-ui-materialui
install-ra-i18n-polyglot:
	npm install ra-i18n-polyglot
install-ra-language-chinese:
	npm install @haxqer/ra-language-chinese
install-ra-language-english:
	npm install ra-language-english
install-mui-material:
	npm install @mui/material
install-react-is:
	npm install react-is

link-gojs:
	npm link peacetrue-gojs

# -------------------- modules --------------------------------
link-file:
	npm link peacetrue-modules-file


# -------------------- common --------------------------------

install-ts:
	npm i typescript tslib ts-node --save-dev
install-jest:
	npm install @testing-library/react jest @types/jest jest-environment-jsdom --save-dev
install-jest-fetch-mock:
	npm install --save-dev jest-fetch-mock
#install-jest:
#	npm install -D jest
#	npm install -D @babel/preset-typescript
#
install-react:
	npm install react

install-lodash:
	npm install lodash
	npm i --save-dev @types/lodash
install-lodash-es:
	npm install lodash-es
	npm i --save-dev @types/lodash-es
install-lodash-merge:
	npm i --save lodash.merge
	npm i --save-dev @types/lodash.merge
install-qs:
	npm install qs
	npm i --save-dev @types/qs

# -------------------- lint --------------------------------
lint-fix:
	tsdx lint --fix
audit-fix:
	npm audit fix --force
