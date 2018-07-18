package de.unidue.ltl.ctestbuilder.service.LangId;

import java.util.HashMap;
import java.util.Map;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.knallgrau.utils.textcat.TextCategorizer;

/**
 * Class defining the Language Identification Service REST API, which identifies the language of texts. 
 * <p>
 * The service offers the following endpoints: 
 * <ul>
 * <li>{@code /} Offers information about the usage of the API.
 * <li>{@code /verify} Offers information about the status and version of the service.
 * <li>{@code /classify} Offers the language identification. 
 * </ul><p>
 * The {@code /classify} endpoint can be accessed with a {@code POST} Request.
 * The request must contain the text for which the language should be found.
 * The text to be converted must be supplied in the body of the request.
 * A {@code Content-type: text/plain} header must be present in the request.
 */
// TODO: Edit index.jsp to be more informative.
@Path("/")
public class TextCat {
	
	private static final String corsOrigins = "*";
	private static final Map<String, String> langName2ISO = new HashMap<String, String>();
	static {
		langName2ISO.put("german", "de");
		langName2ISO.put("english", "en");
		langName2ISO.put("french", "fr");
		langName2ISO.put("spanish", "es");
		langName2ISO.put("italian", "it");
		langName2ISO.put("swedish", "sv");
		langName2ISO.put("polish", "pl");
		langName2ISO.put("dutch", "nl");
		langName2ISO.put("norwegian", "no");
		langName2ISO.put("finnish", "fi");
		langName2ISO.put("albanian", "sq");
		langName2ISO.put("slovakian", "sk");
		langName2ISO.put("slovenian", "sl");
		langName2ISO.put("danish", "da");
		langName2ISO.put("hungarian", "hu");
	}

	public TextCat() {
		categorizer = new TextCategorizer();
	}
	
	private final TextCategorizer categorizer;

	/**
	 * Indicates whether the Language Identification Service is running. 
	 * 
	 * @return A {@code Response} with the status text and version number.
	 */
	@GET
	@Path("/verify")
	@Produces(MediaType.TEXT_HTML)
	public Response verifyRESTService() {
		// TODO proper response
		return Response
				.status(Response.Status.OK)
				.entity("TextCat language identification service successfully started.")
				.header("Access-Control-Allow-Origin", corsOrigins)
				.header("Access-Control-Allow-Methods", "GET")
				.build();
	}
	
	/**
	 * Returns the language for the given text, as ISO 639-1 Language Code String.
	 */
	@POST
	@Path("/classify")
	@Consumes(MediaType.TEXT_PLAIN)
	@Produces(MediaType.TEXT_PLAIN)
	public Response identifyLanguage(String docText) {
		
		String result = categorizer.categorize(docText);
	
		return Response
				.status(200)
				.entity(langName2ISO.get(result))
				.header("Access-Control-Allow-Origin", corsOrigins)
				.header("Access-Control-Allow-Methods", "POST")
				.build();
	}
	

}