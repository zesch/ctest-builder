package de.unidue.ltl.ctestbuilder.service.gapscheme;

import org.junit.Test;

import junit.framework.TestCase;

public class CTestBuilderTest extends TestCase {
	@Test
	public void testGapScheme() throws Exception {
		CTestBuilder ctb = new CTestBuilder();
		String text = "Angela Merkel ist eine Politikerin. Nathalie ist leider nicht zu 100% Politikerin in Hamburg.";
		String language = "de";
		
		ctb.generateCTest(text,language);
	}
}
