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

@Path("/")
public class TextCat {
	
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

	@GET
	@Path("/verify")
	@Produces(MediaType.TEXT_HTML)
	public String verifyRESTService() {
		// TODO proper response
		return "TextCat language identification service successfully started.";
	}
	
	@POST
	@Path("/classify")
	@Consumes(MediaType.TEXT_PLAIN)
	@Produces(MediaType.TEXT_PLAIN)
	public Response identifyLanguage(String docText) {
		
		String result = categorizer.categorize(docText);
	
		return Response.status(200).entity(langName2ISO.get(result)).build();
	}
	

}