package de.unidue.ltl.ctestbuilder.service.gapscheme;

import java.util.Collection;
import java.util.List;
import java.util.function.Predicate;

import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.uima.analysis_engine.AnalysisEngine;
import org.apache.uima.analysis_engine.AnalysisEngineProcessException;
import org.apache.uima.resource.ResourceInitializationException;

import de.tudarmstadt.ukp.dkpro.core.api.segmentation.type.Token;
import testDifficulty.core.CTestObject;
import testDifficulty.core.CTestToken;

@Path("/")
public class GapScheme {
	
	private CTestBuilder builder;	
	
	public GapScheme()
	{	
		builder = new CTestBuilder();	
	}
	
	@GET
	@Path("/verify")
	@Produces(MediaType.TEXT_HTML)
	public Response verifyRESTService() {
		return Response
		.status(200)
		.entity("GapScheme service successfully started.")
		.build();
	}
	
	@POST
	@Path("/gapify")
	@Consumes(MediaType.TEXT_PLAIN)
	@Produces(MediaType.APPLICATION_JSON)
	public Response createGapScheme(String docText, @QueryParam("language") String language) {
		Response response;
		
		try {
			CTestObject cTest = builder.generateCTest(docText, language);
			response = Response
					.status(200)
					.entity(toJson(cTest, builder.getWarnings()).toString())
					.build(); 
		} catch(ResourceInitializationException e) {
			response = Response
					.status(Response.Status.INTERNAL_SERVER_ERROR)
					.entity("{\"message\" : \"ERROR: Could not initialise AnalysisEngines.\"}")
					.build();
			System.err.println("ERROR: Could not initialise AnalysisEngines.");
			e.printStackTrace();
		} catch (AnalysisEngineProcessException e) {
			response = Response
					.status(Response.Status.INTERNAL_SERVER_ERROR)
					.entity("{\"message\" : \"ERROR: Could not process text.\"}")
					.build();
			System.err.println("ERROR: Could not process text.");
			e.printStackTrace();
		}
		
		return response;
	}
	
	JsonObjectBuilder toJson(CTestToken token) {
		JsonArrayBuilder jsonArr = Json.createArrayBuilder();
		JsonObjectBuilder jsonObj = Json.createObjectBuilder()
			.add("id", token.getId())
			.add("showAlternatives", false)
			.add("alternatives", jsonArr.build())
			.add("boldstatus", false)
			.add("gapStatus", token.isGap())
			.add("offset", token.getGapIndex() - 1) // see frontend for reason
			.add("value", token.getText());
		
		return jsonObj;
	}
	
	JsonObject toJson(CTestObject ctest, List<String> warningList) {
		JsonArrayBuilder words = Json.createArrayBuilder();
		
		int id = 1;
		for (CTestToken token : ctest.getTokens()) {
			token.setId(Integer.toString(id));			
			words.add(toJson(token));
			id++;
		}
		
		JsonArrayBuilder warnings = Json.createArrayBuilder();
		for (String warning : warningList) {
			warnings.add(warning);
		}
		
		JsonObjectBuilder json = Json.createObjectBuilder()
			.add("words", words.build())
			.add("warnings", warnings.build());
		
		return json.build();
	}
	
}