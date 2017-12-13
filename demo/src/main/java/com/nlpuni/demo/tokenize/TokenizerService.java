package com.nlpuni.demo.tokenize;

import java.util.ArrayList;
import java.util.List;

public class TokenizerService {

	public List<TokenDTO> getTokens(String text) {
		String[] texts = text.split(" ");
		
		List<TokenDTO> res = new ArrayList<TokenDTO>();
		
		for(int i = 0; i < texts.length; i++) {
			TokenDTO a = new TokenDTO(i, texts[i], new String[0], 3, false, false );
			res.add(a);
		}
		
		return res;
	}
	
}
