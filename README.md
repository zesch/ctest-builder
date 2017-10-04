# CTestBuilder

## Prerequisites
This project requires Node 6.9.0 or higher, together with NPM 3 or higher. And Angular CLI.

## Angular CLI
```npm install -g @angular/cli```

## Localhosting
```
git clone https://github.com/zesch/ctest-builder.git
cd c-test-builder
npm install
ng serve
```

## Run on server with http-server
```http-server dist/ -p 8000 > ./output.log &```

## Post on github page
```
ng build --prod --base-href https://zesch.github.io/ctest-builder/
ngh
```