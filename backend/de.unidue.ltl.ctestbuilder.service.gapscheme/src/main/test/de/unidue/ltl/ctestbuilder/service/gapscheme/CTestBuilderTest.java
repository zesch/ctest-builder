package de.unidue.ltl.ctestbuilder.service.gapscheme;

import org.junit.Test;

import de.unidue.ltl.ctestbuilder.service.gapscheme.CTestBuilder;
import junit.framework.TestCase;

public class CTestBuilderTest extends TestCase {
	@Test
	public void testGapScheme() throws Exception {
		CTestBuilder ctb = new CTestBuilder();
		String text = "Angela Merkel ist eine Politikerin. Bananenbrot Nathalie ist leider nicht zu 100% Politikerin in Hamburg, aber sie mag auch keine Augangssperre. Dieser Satz sollte keine Gaps erhalten.";
		String language = "de";
		
		System.out.println(ctb.generateCTest(text,language));
	}
}
