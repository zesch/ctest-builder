package de.unidue.ltl.ctestbuilder.service.gapscheme;

import java.io.File;
import java.io.StringReader;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.json.JsonString;
import javax.json.JsonValue;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.tools.ant.taskdefs.TempFile;

import de.unidue.ltl.ctest.core.CTestObject;
import de.unidue.ltl.ctest.core.CTestToken;
import de.unidue.ltl.ctest.gapscheme.CTestGenerator;
import de.unidue.ltl.ctest.io.CTestJACKReader;
import de.unidue.ltl.ctest.util.Transformation;

/**
 * Class defining the GapScheme REST API, which provides <a href="https://de.wikipedia.org/wiki/C-Test">c-tests</a>. 
 * <p>
 * The service offers the following endpoints: 
 * <ul>
 * <li>{@code /} Offers information about the usage of the API.
 * <li>{@code /verify} Offers information about the status and version of the service.
 * <li>{@code /gapify} Offers the c-test generation of the service. 
 * <li>{@code /gapify-partial} Offers a simplified c-test generation.
 * <li>{@code /update-gaps} Offers a re-gapping of a list of CTestTokens. 
 * <li>{@code /fromJACK} Offers c-test generation from JACK Stage XMLs.
 * </ul><p>
 * The {@code /gapify} endpoint can be accessed with a {@code POST} Request.
 * The request must contain the text to be converted to a c-test and the the language of the text.
 * The text to be converted must be supplied in the body of the request.
 * The language must be specified in the {@code language} query parameter as a ISO 639-1 Language Code.
 * A {@code Content-type: text/plain} header must be present in the request.
 */
@Path("/")
public class GapScheme {

	private static final String corsOrigins = "*";
	
	private CTestGenerator builder;

	/**
	 * Creates a {@code GapScheme} object.
	 * Should not be necessary to be explicitly created.
	 */
	public GapScheme() {
		builder = new CTestGenerator();
		builder.setEnforcesLeadingSentence(false);
		builder.setEnforcesTrailingSentence(false);
	}
	
	/**
	 * Indicates whether the GapScheme Service is running. 
	 * 
	 * @return A {@code Response} with the status text and version number.
	 */
	@GET
	@Path("/verify")
	@Produces(MediaType.TEXT_HTML)
	public Response verifyRESTService() {
		System.out.println("verify endpoint called");
		return Response
				.status(Response.Status.OK)
				.entity("GapScheme service successfully started. Version: 0.0.3-SNAPSHOT")
				.build();
	}
	
	/**
	 * Creates a C-Test from the given text and the specified language.
	 * 
	 * @param  docText The text to be converted into a c-Test.
	 * @param  language The language of the Text. Should be a two-letter ISO 639-1 Language Code.
	 * @return A {@code Response}, containing the c-Test and potential warnings, regarding the generation process as JSON String.
	 */
	@POST
	@Path("/gapify")
	@Consumes(MediaType.TEXT_PLAIN)
	@Produces(MediaType.APPLICATION_JSON)
	public Response createGapScheme(String docText, @QueryParam("language") String language) {
		if (language == null || docText == null)
			return Response
					.status(Response.Status.BAD_REQUEST)
					.entity("{\"message\" : \"ERROR: language and text must not be null.\"}")
					.build();
		
		Response response;

		try {
			JsonObject cTest = Transformation.toJSON(builder.generateCTest(docText, language), builder.getWarnings());
			response = Response
					.status(Response.Status.OK)
					.entity(cTest.toString())
					.build();
		} catch (Exception e) {
			response = Response
					.status(Response.Status.INTERNAL_SERVER_ERROR)
					.entity("{\"message\" : \"ERROR: Could not create c-test.\"}")
					.build();
			e.printStackTrace();
		}

		return response;
	}
	
	/**
	 * Creates a partial C-Test from the given text and the specified language.
	 * The gapscheme is applied to each token, starting with the very first.
	 * Usual constraints, like the gap limit or ungapped opening and closing sentences are ignored.
	 * 
	 * @param  docText The text to be converted into a c-Test.
	 * @param  language The language of the Text. Should be a two-letter ISO 639-1 Language Code.
	 * @return A {@code Response}, containing the c-Test and potential warnings, regarding the generation process as JSON String.
	 */
	@POST
	@Path("/gapify-partial")
	@Consumes(MediaType.TEXT_PLAIN)
	@Produces(MediaType.APPLICATION_JSON)
	public Response createSimpleGapScheme(String docText, @QueryParam("language") String language, @QueryParam("gapfirst") Boolean gapFirst) {
		if (language == null || docText == null || gapFirst == null)
			return Response
					.status(Response.Status.BAD_REQUEST)
					.entity("{\"message\" : \"ERROR: Query parameters 'language', 'text' and 'gapfirst' must not be null.\"}")
					.build();
		
		Response response;

		try {
			JsonObject cTest = Transformation.toJSON(builder.generatePartialCTest(docText, language, gapFirst), new ArrayList<String>());
			response = Response
					.status(Response.Status.OK)
					.entity(cTest.toString())
					.build();
		} catch (Exception e) {
			response = Response
					.status(Response.Status.INTERNAL_SERVER_ERROR)
					.entity("{\"message\" : \"ERROR: Could not create c-test.\"}")
					.build();
			e.printStackTrace();
		}

		return response;
	}

	/**
	 * Creates a C-Test from the given JACK Stage XML String.
	 * Note that the resulting C-Test will <b>not</b> be processed.
	 * Consequently, opening and closing sentences and named entities will not be marked as non-candidates.
	 * 
	 * @param  request a string representing a JACK Stage XML to be converted into a c-Test.
	 * @return A {@code Response}, containing the c-Test and warnings, regarding the generation process as JSON String.
	 */
	@POST
	@Path("/fromJACK")
	@Consumes(MediaType.TEXT_PLAIN)
	@Produces(MediaType.APPLICATION_JSON)
	public Response fromJACK(String request) {
		System.out.println("/fromJack endpoint called");
		if (request == null) {
			return Response
					.status(Response.Status.BAD_REQUEST)
					.entity("{\"message\" : \"ERROR: Request body must not be empty. See API Specification for details. \"}")
					.build();
		}
		
		Response response;
		
		try {
			// convert to c-test
			File file = File.createTempFile(UUID.randomUUID().toString(), ".xml", null);
			Files.write(Paths.get(file.getPath()), request.getBytes());
			CTestObject ctest = new CTestJACKReader().read(file);
			file.delete();
			
			// send response
			String body = Transformation.toJSON(ctest, new ArrayList<>()).toString();
			response = Response
					.status(Response.Status.OK)
					.entity(body)
					.build();
		} catch (Exception e) {
			e.printStackTrace();
			response = Response
				.status(Response.Status.INTERNAL_SERVER_ERROR)
				.entity("{\"message\" : \"ERROR: Could not create c-test.\"}")
				.build();
		}
		
		return response;
	}
	

	
	/**
	 * Updates the gap status of the given JSON Array of FrontendCTestTokens.
	 * <p>
	 * The request body must contain a JSON Array of FrontendCTestTokens.
	 * The gap status of the tokens is updated, following the usual Gapping rules.
	 * If a given token is flagged as not normal, it remains unchanged.
	 * If the "gapfirst" parameter is set to "true", gapping starts with the first token.
	 * 
	 * @param request The request body. Should represent a JSON Array of FrontendCTestTokens.
	 * @param gapFirst Indicates whether the gapping should start with the first token.
	 * @return A Response containing a JSON Array of FrontendCTestTokens with updated gaps.
	 */
	@POST
	@Path("/update-gaps")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response updateGaps(String request, @QueryParam("gapfirst") Boolean gapFirst) {
		if (gapFirst == null)
			return Response
					.status(Response.Status.BAD_REQUEST)
					.entity("{\"message\" : \"ERROR: Query parameter 'gapfirst' must not be null.\"}")
					.build();
		
		if (request == null)
			return Response
					.status(Response.Status.BAD_REQUEST)
					.entity("{\"message\" : \"ERROR: Request body must not be empty. See API Specification for details. \"}")
					.build();
		
		Response response;
		
		try {
			List<CTestToken> tokens = Transformation.fromJSONArray(request).getTokens();
					
			tokens = builder.updateGaps(tokens, gapFirst);
			
			response = Response
					.status(Response.Status.OK)
					.entity(Transformation.toJSON(tokens).toString())
					.build();
		} catch (Exception e) {
			response = Response
					.status(Response.Status.INTERNAL_SERVER_ERROR)
					.entity("{\"message\" : \"ERROR: Could not create c-test.\"}")
					.build();
			e.printStackTrace();
		}

		return response;
	}

}