# CTestBuilder

## Prerequisites
This project is built using 

+ Node (6.9.0 or higher)
+ NPM  (3.0.0 or higher) 
+ Angular CLI (1.7.3). 
+ Apache Tomcat (9.0.0 or higher)
+ Maven (3.0.0 or higher)

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

## Setup

First, install all required tools, listed under prerequisites. 
After that, clone the repository and install all required npm dependencies.

```
git clone https://github.com/zesch/ctest-builder.git
cd c-test-builder
npm install
```

To build the GapScheme Service, you first need to install the _difficultyPrediction_ Project and the _c-test-tools_ Project in your local Maven repository.

```
git clone https://www.github.com/zesch/c-test-scoring
cd c-test-scoring/difficultyPrediction/
mvn install
```

```
git clone https://www.github.com/ltl-ude/c-test-tools
cd ./c-test-tools/
mvn install
cd ./de.unidue.ltl.ctest.core/
mvn install
cd ../de.unidue.ltl.ctest.gapscheme/
mvn install
```

You should now be able to build and deploy the project.

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
+ Navigate to the Servers View (`Window -> Show View -> Servers`) 
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

When you need to perform this task more often, you may want to automate deployment in a custom shell script.

**Note:** In case you never deployed the CTest Builder before, you may need to copy the `<c.test.builder>/docker` directory to some directory on the server (this may be your user's home directory). `<c.test.builder>` refers to the full path to the project's repository.

### Building all required services

Run the following commands to build all services using the following commands, the `build.sh` script or a suitable alternative.

```
cd <c.test.builder>/backend/de.unidue.ltl.ctestbuilder.service.gapscheme/
mvn clean package
cd <c.test.builder>/backend/de.unidue.ltl.ctestbuilder.service.LangId/
mvn clean package
cd <c.test.builder>/frontend/
ng build --prod
```

### Copying built services to the server

Copy the built services to the Docker directory on the server, using the following commands or a suitable alternative. `<server.docker>` refers to the full path of the docker directory on the server. `<user.name>` refers to your username.

```
scp -P 42922 <c.test.builder>/backend/de.unidue.ltl.ctestbuilder.service.gapscheme/target/*.war <user.name>@192.168.231.133:<server.docker>/backend/gapscheme/
scp -P 42922 <c.test.builder>/backend/de.unidue.ltl.ctestbuilder.service.LangId/target/*.war <user.name>@192.168.231.133:<server.docker>/backend/langid/
scp -P 42922 <c.test.builder>/frontend/dist/* <user.name>@192.168.231.133:<server.docker>/frontend/dist/
```

### Starting all Docker services

Execute the following commands on the server. The CTest Builder App will be available in University Networks under http://192.168.231.133:8000.

```
cd <server.docker>
docker-compose build
docker-compose up -d
```

**Note:** The build process produces unused images. To remove them, run `docker rmi $(docker images -f 'dangling=true' -q)`. This will remove all untagged images.

**Note:** In case something went wrong at some earlier deployment, you may need to remove orphaned containers from earlier builds. Identify the orphaned containers, using `docker ps -a` and remove them manually or simply add the `--remove-orphans` to the `docker-compose up` command.
