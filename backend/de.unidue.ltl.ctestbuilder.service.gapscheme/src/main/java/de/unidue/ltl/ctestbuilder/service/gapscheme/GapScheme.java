package de.unidue.ltl.ctestbuilder.service.gapscheme;

import java.util.ArrayList;
import java.util.List;

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

import de.unidue.ltl.ctest.core.CTestObject;
import de.unidue.ltl.ctest.core.CTestToken;
import de.unidue.ltl.ctest.gapscheme.CTestGenerator;

/**
 * Class defining the GapScheme REST API, which provides <a href="https://de.wikipedia.org/wiki/C-Test">c-tests</a>. 
 * <p>
 * The service offers the following endpoints: 
 * <ul>
 * <li>{@code /} Offers information about the usage of the API.
 * <li>{@code /verify} Offers information about the status and version of the service.
 * <li>{@code /gapify} Offers the c-test generation of the service. 
 * </ul><p>
 * The {@code /gapify} endpoint can be accessed with a {@code POST} Request.
 * The request must contain the text to be converted to a c-test and the the language of the text.
 * The text to be converted must be supplied in the body of the request.
 * The language must be specified in the {@code language} query parameter as a ISO 639-1 Language Code.
 * A {@code Content-type: text/plain} header must be present in the request.
 */
//TODO: Edit index.jsp to be more informative.
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
				.entity("GapScheme service successfully started. Version: 0.0.2-SNAPSHOT")
				.header("Access-Control-Allow-Origin", corsOrigins)
				.header("Access-Control-Allow-Methods", "GET")
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
					.header("Access-Control-Allow-Origin", corsOrigins)
					.header("Access-Control-Allow-Methods", "POST")
					.build();
		
		Response response;

		try {
			JsonObject cTest = toJson(builder.generateCTest(docText, language), builder.getWarnings());
			response = Response
					.status(Response.Status.OK)
					.entity(cTest.toString())
					.header("Access-Control-Allow-Origin", corsOrigins)
					.header("Access-Control-Allow-Methods", "POST")
					.build();
		} catch (Exception e) {
			response = Response
					.status(Response.Status.INTERNAL_SERVER_ERROR)
					.entity("{\"message\" : \"ERROR: Could not create c-test.\"}")
					.header("Access-Control-Allow-Origin", corsOrigins)
					.header("Access-Control-Allow-Methods", "POST")
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
					.header("Access-Control-Allow-Origin", corsOrigins)
					.header("Access-Control-Allow-Methods", "POST")
					.build();
		
		Response response;

		try {
			JsonObject cTest = toJson(builder.generatePartialCTest(docText, language, gapFirst), new ArrayList<String>());
			response = Response
					.status(Response.Status.OK)
					.entity(cTest.toString())
					.header("Access-Control-Allow-Origin", corsOrigins)
					.header("Access-Control-Allow-Methods", "POST")
					.build();
		} catch (Exception e) {
			response = Response
					.status(Response.Status.INTERNAL_SERVER_ERROR)
					.entity("{\"message\" : \"ERROR: Could not create c-test.\"}")
					.header("Access-Control-Allow-Origin", corsOrigins)
					.header("Access-Control-Allow-Methods", "POST")
					.build();
			e.printStackTrace();
		}

		return response;
	}
	
	/* 
	 * Converts a single CTestToken to a JSON Object, complying with the FrontendCTestToken Interface.
	 */
	protected JsonObjectBuilder toJson(CTestToken token) {
		JsonArrayBuilder jsonAlternatives = Json.createArrayBuilder();
		token.getOtherSolutions().stream().forEach(jsonAlternatives::add);
		
		JsonObjectBuilder jsonObj = Json.createObjectBuilder()
				.add("id", token.getId())
				.add("alternatives", jsonAlternatives.build())
				.add("gapStatus", token.isGap())
				.add("offset", token.getGapIndex())
				.add("value", token.getText())
				.add("isNormal", token.isCandidate());

		return jsonObj;
	}
	
	/* 
	 * Converts a CTestObject to a JSON Object.
	 * 
	 * The JSON Object contains two properties: words and warnings.
	 * words is a String Array, containing JSON Encoded FrontEndCTestToken Objects.
	 * warnings is a String Array, containing strings with information about potential problems with the c-test.
	 */
	protected JsonObject toJson(CTestObject ctest, List<String> warningList) {
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
				.add("warnings",warnings.build());

		return json.build();
	}

}