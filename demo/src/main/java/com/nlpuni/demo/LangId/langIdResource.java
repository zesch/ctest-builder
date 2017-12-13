package com.nlpuni.demo.LangId;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.json.simple.JSONObject;


@Path("langId")
public class langIdResource {

	
	private langIdService lanIdService = new langIdService();
	
    @POST 
    @Produces(MediaType.TEXT_PLAIN)
    public String getIt(String text) {
    		System.out.println(text);
    		
    		return lanIdService.getLangId(text);
    }
  
}