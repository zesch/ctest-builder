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

+ GapScheme: `<docker>/backend/gapscheme/<GapScheme>.war`
+ LangId: `<docker>/backend/langid/<LangId>.war`
+ Frontend: `<docker>/frontend/dist/<Angular>`

`<GapScheme>` refers to the `.war` file of the GapScheme Webservice.
`<LangId>` refers to the `.war` file of the Language Identification Webservice. 
`<Angular>` refers to the built angular app for the frontend. (The output of `ng build`, i.e. `index.html` etc.)