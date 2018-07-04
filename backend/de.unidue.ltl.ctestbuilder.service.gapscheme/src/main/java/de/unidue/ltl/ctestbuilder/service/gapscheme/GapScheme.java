package de.unidue.ltl.ctestbuilder.service.gapscheme;

import java.util.Collection;
import java.util.List;
import java.util.function.Predicate;

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

@Path("/")
public class GapScheme {
	
	private List<AnalysisEngine> preprocessing;
	private Collection<Predicate<Token>> exclusionCriteria;
	private CTestBuilder builder;	
	
	public GapScheme()
	{	
		builder = new CTestBuilder();	
	}
	
	@GET
	@Path("/verify")
	@Produces(MediaType.TEXT_HTML)
	public String verifyRESTService() {
		// TODO proper response
		return "GapScheme service successfully started.";
	}
	
	@POST
	@Path("/gapify")
	@Consumes(MediaType.TEXT_PLAIN)
	@Produces(MediaType.TEXT_PLAIN)
	public Response createGapScheme(String docText, @QueryParam("language") String language) {
		Response response;
		
		try {
			CTestObject cTest = builder.generateCTest(docText, language);
		} catch(ResourceInitializationException e) {
			response = Response.status(503).entity("").build();
			System.err.println("ERROR: Could not initialise AnalysisEngines.");
			e.printStackTrace();
		} catch (AnalysisEngineProcessException e) {
			response = Response.status(503).entity("").build();
			System.err.println("ERROR: Could not process text.");
			e.printStackTrace();
		}
		
		response = Response.status(200).entity("").build(); 
		
		return response;
	}
	
}