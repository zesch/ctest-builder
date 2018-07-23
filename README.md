# CTestBuilder

## Prerequisites
This project requires Node 6.9.0 or higher, together with NPM 3 or higher. And Angular CLI. Furthermore, Apache Tomcat 9.0 and Maven 3.0

## Setup

### Cloning the repository
```
git clone https://github.com/zesch/ctest-builder.git
cd c-test-builder
npm install
```

### Angular CLI
```
npm install -g @angular/cli
npm install ng2-webstorage
```

### Tomcat

https://tomcat.apache.org/download-90.cgi

### Maven 

https://maven.apache.org/download.cgi

On Windows, make sure to add Maven to your `PATH` environment variable.

## Local Deployment

### C-Test App
Just execute the following commands. The app will be available under http://localhost:4200.

```
cd <c-test-builder>
ng serve
```

### C-Test Webservice

The Webservice can be deployed manually, by building the project and copying the war to the local tomcat installation. 
Alternatively, the service can be deployed using eclipse. 
The service will be available under `http://localhost:8080/de.unidue.ltl.ctestbuilder.service.GapScheme/rest/`

**Note:** To build the GapScheme Service, you first need to install the `difficultyPrediction` Project to your local maven repository.

```
git clone `https://www.github.com/zesch/c-test-scoring`
cd c-test-scoring/difficultyPrediction/
mvn install
```

#### Manual Deployment

Execute the following commands. `<c-test-builder>` refers to the full path to the project's repository. 
`<tomcat-9>` refers to the full path to the local Tomcat installation.

```
cd <c-test-builder>/backend/
mvn clean package
cp <c-test-builder>/backend/target/*.war <tomcat-9>/webapps/
cd <tomcat-9>/bin
./startup.sh 
```

**NOTE:** Under windows, use `./startup.bat` instead of `./startup.sh`.

##### Eclipse Deployment

Deployment using eclipse requires the local Tomcat installation to be added as a server in the Workspace. Follow these steps in Eclipse:

+ Add the project to your workspace.
+ Navigate to the Servers View (`Window->Show View->Servers`) 
+ Add a new Server (`Servers View -> New... -> Server` Settings: `Server Type: Apache/Tomcat v9.0 Server. Server's host name: localhost`.) 
+ Add the Webservice to the Server (`Server -> Add and Remove... -> de.unidue.ltl.ctestbuilder.service.GapScheme`)    

The service can then be started from eclipse, by starting the server.

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