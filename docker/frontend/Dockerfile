FROM node:6-alpine

COPY dist/* ctest_builder/

RUN npm install -g http-server

CMD http-server ctest_builder/ -p 8080
