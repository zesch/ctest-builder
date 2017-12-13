package com.nlpuni.demo.tokenize;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.json.simple.JSONObject;

/**
 * Root resource (exposed at "myresource" path)
 */
@Path("myresource")
public class MyResource {

    /**
     * Method handling HTTP GET requests. The returned object will be sent
     * to the client as "text/plain" media type.
     *
     * @return String that will be returned as a text/plain response.
     */
	
	private TokenizerService tokenizerService = new TokenizerService();

    @POST 
    @Produces(MediaType.APPLICATION_JSON)
    public List<TokenDTO> getIt(String text, @QueryParam("LanID") String LanID ) {
    		System.out.println(text);
    		System.out.println(LanID);
    		return tokenizerService.getTokens(text);
    }
    
    
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public JSONObject getJson() {
        JSONObject obj = new JSONObject();
        obj.put("first","first haha");

        obj.put("second", "second haha");
        
        return obj;
    }
}
