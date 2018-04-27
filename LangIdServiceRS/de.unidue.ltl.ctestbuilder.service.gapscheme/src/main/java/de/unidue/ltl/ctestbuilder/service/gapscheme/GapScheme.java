package de.unidue.ltl.ctestbuilder.service.gapscheme;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.uima.analysis_engine.AnalysisEngine;
import org.apache.uima.analysis_engine.AnalysisEngineProcessException;
import org.apache.uima.fit.factory.AnalysisEngineFactory;
import org.apache.uima.fit.util.JCasUtil;
import org.apache.uima.jcas.JCas;
import org.apache.uima.resource.ResourceInitializationException;

import de.tudarmstadt.ukp.dkpro.core.api.segmentation.type.Sentence;
import de.tudarmstadt.ukp.dkpro.core.api.segmentation.type.Token;
import de.tudarmstadt.ukp.dkpro.core.tokit.BreakIteratorSegmenter;

@Path("/")
public class GapScheme {
	
	private AnalysisEngine tokenizer;
	
	public GapScheme() 
			throws ResourceInitializationException
	{
		tokenizer = AnalysisEngineFactory.createEngine(BreakIteratorSegmenter.class);
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
	public Response createGapScheme(String docText) {
		
		try {
			JCas jcas = tokenizer.newJCas();
			jcas.setDocumentText(docText);
	        tokenizer.process(jcas);
	        
	        for (Sentence s : JCasUtil.select(jcas, Sentence.class)) {
	        	for (Token t : JCasUtil.selectCovered(jcas,  Token.class, s)) {
	        		System.out.println(t.getCoveredText());
	        	}
	        	System.out.println();
	        }
		} catch (ResourceInitializationException e) {
			e.printStackTrace();
		} catch (AnalysisEngineProcessException e) {
			e.printStackTrace();
		}
        
		return Response.status(200).entity("").build();
	}
}