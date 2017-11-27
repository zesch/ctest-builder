# CTestBuilder

## Prerequisites
This project requires Node 6.9.0 or higher, together with NPM 3 or higher. And Angular CLI.

## Angular CLI
```
npm install -g @angular/cli
npm install ng2-webstorage
```

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

## scp to server
```scp -r -P 42922 dist wang@134.91.18.133:~/```


## Docker operations in server
```
//create container
docker run -it --rm -p 9000:8080 tomcat:9.0 tail /dev/null -f

//go in to the container bash
docker exec -it e146c4089a86 /bin/bash


//preparation
cd conf
vim tomcat-users.xml
https://stackoverflow.com/a/39462403/2948417


//start tomcat
cd bin
./startup.sh
```

## Deploy to server
* Compile client side ```ng build --prod --base-href http://134.91.18.133:9000/demo/```
* Copy to server side under src/main/webapp
* Export as WAR
* Deploy with tomcat manager panel