package de.unidue.ltl.ctestbuilder.service.gapscheme;

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
import org.apache.uima.fit.factory.AnalysisEngineFactory;
import org.apache.uima.fit.util.JCasUtil;
import org.apache.uima.jcas.JCas;
import org.apache.uima.resource.ResourceInitializationException;

import de.tudarmstadt.ukp.dkpro.core.api.segmentation.type.Sentence;
import de.tudarmstadt.ukp.dkpro.core.api.segmentation.type.Token;
import de.tudarmstadt.ukp.dkpro.core.tokit.BreakIteratorSegmenter;
import testDifficulty.core.CTestObject;
import testDifficulty.core.CTestToken;

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
	public Response createGapScheme(String docText, @QueryParam("language") String language) {
		
		try {
			
			makeGaps(docText, language);
			
		} catch (ResourceInitializationException e) {
			e.printStackTrace();
		} catch (AnalysisEngineProcessException e) {
			e.printStackTrace();
		}
        
		return Response.status(200).entity("").build();
	}
	
	private void makeGaps(String docText, String language) 
			throws ResourceInitializationException, AnalysisEngineProcessException
	{
		JCas jcas = tokenizer.newJCas();
		jcas.setDocumentText(docText);
        tokenizer.process(jcas);
        
        CTestObject ctest = new CTestObject(language);
        
        int nrOfGaps = 0;
        int sentenceOffset = 0;
        int tokenOffset = 0;
        
        
        for (Sentence s : JCasUtil.select(jcas, Sentence.class)) {
        	for (Token t : JCasUtil.selectCovered(jcas,  Token.class, s)) {
        		CTestToken cToken = new CTestToken(t.getCoveredText());
        		if (sentenceOffset > 0) {	// do not gap first sentence
        			if (tokenOffset % 2 == 0) {
        				cToken.setGap(true);
        				nrOfGaps++;
        			}
        		}
        		ctest.addToken(cToken);	
        		tokenOffset++;
        	}
        	sentenceOffset++;
        }
        System.out.println(ctest.toString());
        System.out.println(nrOfGaps);
	}
}