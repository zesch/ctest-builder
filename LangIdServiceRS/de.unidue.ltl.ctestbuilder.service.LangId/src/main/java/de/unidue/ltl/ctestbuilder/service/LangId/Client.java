package de.unidue.ltl.ctestbuilder.service.LangId;


import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.URL;
import java.net.URLConnection;
  
public class Client {

	public static void main(String[] args) {
		String string = "This is a test.";
 
		try {
			URL url = new URL("http://localhost:8080/LangId/rest/classify");
			URLConnection connection = url.openConnection();
			connection.setDoOutput(true);
			connection.setRequestProperty("Content-Type", "text/plain");
				connection.setConnectTimeout(5000);
				connection.setReadTimeout(5000);
				OutputStreamWriter out = new OutputStreamWriter(connection.getOutputStream());
				out.write(string);
				out.close();
 
				BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
 
				String line;
				while ((line = in.readLine()) != null) {
					System.out.println(line);
				}
			in.close();
		} catch (Exception e) {
			System.out.println("\nError while calling  REST Service");
			System.out.println(e);
		}

	}
}