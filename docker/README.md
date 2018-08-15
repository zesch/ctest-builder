## Setup

Copy this directory to server. 
`<docker>` refers to the directory on the server.

## Running the docker containers on the server

```
cd <docker>
docker-compose build
docker-compose up -d
```

## Updating the CTest Builder

All services need to be built and placed in the `<docker>` folder. Docker images need to be rebuilt, as explained in the previous section. 
The built services need to be placed under the following directories:

+ GapScheme: `<docker>/service/gapscheme/GapScheme.war`
+ LangId: `<docker>/service/langid/LangId.war`
+ Frontend: `<docker>/frontend/dist/<frontend>`

`<frontend>` refers to the output of `ng build`.