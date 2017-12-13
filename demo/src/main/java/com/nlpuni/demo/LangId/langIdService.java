package com.nlpuni.demo.LangId;

import java.util.Random;

public class langIdService {

	private enum Languages {
        en,
        fr,
        de;


        public static Languages getRandomLanguage() {
            Random random = new Random();
            return values()[random.nextInt(values().length)];
        }
    }
	
	public String getLangId(String text) {
		//detect the language and return the id
		
		return Languages.getRandomLanguage().toString();
	}
}
