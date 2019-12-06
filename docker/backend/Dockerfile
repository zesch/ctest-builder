# define prepare stage
FROM tomcat:9-jre8-alpine AS prepare

COPY gapscheme/*.war GapScheme.war
COPY langid/*.war LangId.war

# unzip in prepare stage, to save space
RUN mkdir gapscheme && unzip GapScheme.war -d gapscheme
RUN mkdir langid && unzip LangId.war -d langid

# define run stage
FROM tomcat:9-jre8-alpine AS run

RUN rm -rf webapps/* && \
    apk update

# reachable under <host>/gapscheme and <host>/langid
COPY --from=prepare /usr/local/tomcat/gapscheme webapps/gapscheme
COPY --from=prepare /usr/local/tomcat/langid webapps/langid

# configure Tomcat
COPY server.xml conf/server.xml
ENV CATALINA_OPTS="-Xms4g -Xmx16g"

# run on startup
CMD catalina.sh run
