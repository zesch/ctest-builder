package de.unidue.ltl.ctestbuilder.service.preprocessing;

import org.apache.uima.UIMAException;
import org.apache.uima.fit.factory.JCasBuilder;
import org.apache.uima.fit.factory.JCasFactory;
import org.apache.uima.jcas.JCas;
import org.junit.Test;

import de.tudarmstadt.ukp.dkpro.core.api.segmentation.type.Token;
import junit.framework.TestCase;

public class FrenchAbbreviationGapFinderTest extends TestCase {
	@Test
	public void testApostrophe() throws UIMAException {
		JCas jcas = JCasFactory.createJCas();
		JCasBuilder jcasBuilder = new JCasBuilder(jcas);

		Token apostrophe = jcasBuilder.add("l'baguette", Token.class);
		jcasBuilder.add(" ");
		
		Token abbrev = jcasBuilder.add("qu'aujourd'hui", Token.class);
		jcasBuilder.add(" ");

		Token word = jcasBuilder.add("oui", Token.class);
		jcasBuilder.add(" ");

		jcasBuilder.close();

		GapIndexFinder gif = new FrenchAbbreviationGapFinder();

		assertTrue(gif.test(apostrophe));
		assertEquals(2, gif.getGapIndex(apostrophe));
		
		assertTrue(gif.test(abbrev));
		assertEquals(3, gif.getGapIndex(abbrev));

		assertFalse(gif.test(word));
	}
}
