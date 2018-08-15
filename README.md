# CTestBuilder

## Prerequisites
This project is built using 

+ Node (6.9.0 or higher)
+ NPM  (3.0.0 or higher) 
+ Angular CLI (1.7.3). 
+ Apache Tomcat (9.0.0 or higher)
+ Maven (3.0.0 or higher)

## Setup

### Cloning the repository
```
git clone https://github.com/zesch/ctest-builder.git
cd c-test-builder
npm install
```

### Node & NPM

https://nodejs.org/en/download/

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
cd <c.test.builder>/frontend
ng serve
```

### C-Test Webservice

The GapScheme Service can be deployed in one of two ways - manually or using eclipse. 
In both cases, the webservice will be available under http://localhost:8080/de.unidue.ltl.ctestbuilder.service.GapScheme/rest/.

To build the GapScheme Service, you first need to install the difficultyPrediction Project in your local Maven repository.

```
git clone https://www.github.com/zesch/c-test-scoring
cd c-test-scoring/difficultyPrediction/
mvn install
```

#### Manual Deployment

Execute the following commands. 
`<c.test.builder>` refers to the full path to the project's repository. 
`<tomcat>` refers to the full path to the local Tomcat installation.

```
cd <c.test.builder>/backend/de.unidue.ltl.ctestbuilder.service.gapscheme/
mvn clean package
cp target/*.war <tomcat>/webapps/
cd <tomcat>/bin
./startup.sh 
```

**Note:** Under windows, use `./startup.bat` instead of `./startup.sh`.

#### Eclipse Deployment

Deployment using Eclipse requires the local Tomcat installation to be added as a server in the Workspace. Follow these steps in Eclipse:

+ Add the project to your workspace.
+ Navigate to the Servers View (`Window->Show View->Servers`) 
+ Add a new Server (`Servers View -> New... -> Server`)
  Server Type: `Apache/Tomcat v9.0 Server`  
  Server's host name: `localhost`  
+ Add the Webservice to the Server (`Server -> Add and Remove... -> de.unidue.ltl.ctestbuilder.service.GapScheme`)    

The service can then be started from eclipse, by starting the server.

## Deployment on the server

Deployment on the server comprises three steps:

1. Building all required services
2. Copying built services to the server
3. Starting all Docker services

In case you never deployed the CTest Builder before, you may need to copy the `<c.test.builder>/docker` directory to some directory on the server (this may be your user's home directory). `<c.test.builder>` refers to the full path to the project's repository.

### Building all required services

Run the following commands to build all services.
```
cd <c.test.builder>/backend/de.unidue.ltl.ctestbuilder.service.gapscheme/
mvn clean package
cd <c.test.builder>/backend/de.unidue.ltl.ctestbuilder.service.LangId/
mvn clean package
cd <c.test.builder>/frontend/
ng build --prod
```

### Copying built services to the server

Copy the built services to the Docker folder on the server. `<server.docker>` refers to the full path of the docker directory on the server. `<user.name>` refers to your username.

```
scp -P 42922 <c.test.builder>/backend/de.unidue.ltl.ctestbuilder.service.gapscheme/target/*.war <user.name>@134.91.18.133:<server.docker>/backend/gapscheme/
scp -P 42922 <c.test.builder>/backend/de.unidue.ltl.ctestbuilder.service.LangId/target/*.war <user.name>@134.91.18.133:<server.docker>/backend/langid/
scp -P 42922 <c.test.builder>/frontend/dist/* <user.name>@134.91.18.133:<server.docker>/frontend/dist/
```

### Starting all Docker services

Execute the following commands on the server. The CTest Builder App will be available under http://134.91.18.133:8000, as specified in `<c.test.builder>/docker/docker-compose.yml`.

```
cd <server.docker>
docker-compose build
docker-compose up -d
```

**Note:** In case something went wrong at some earlier deployment, you may need to remove orphaned containers from earlier builds. To do this, run `docker-compose up -d --remove-orphans`.