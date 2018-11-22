#! /bin/bash
cd backend/de.unidue.ltl.ctestbuilder.service.gapscheme/
mvn clean package
cd ../de.unidue.ltl.ctestbuilder.service.LangId/
mvn clean package
cd ../../frontend/
ng build --prod
