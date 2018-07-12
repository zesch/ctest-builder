package de.unidue.ltl.ctestbuilder.service.preprocessing;

import org.apache.uima.UIMAException;
import org.apache.uima.fit.factory.JCasBuilder;
import org.apache.uima.fit.factory.JCasFactory;
import org.apache.uima.jcas.JCas;
import org.junit.Test;

import de.tudarmstadt.ukp.dkpro.core.api.segmentation.type.Token;
import junit.framework.TestCase;

public class IsPunctuationTest extends TestCase {

	@Test
	public void testPunctuation() throws UIMAException {
		JCas jcas = JCasFactory.createJCas();
		JCasBuilder jcasBuilder = new JCasBuilder(jcas);

		Token punctuation = jcasBuilder.add("¿", Token.class);
		Token word = jcasBuilder.add("a", Token.class);

		jcasBuilder.close();

		IsPunctuation criterion = new IsPunctuation();

		assertFalse(criterion.test(word));
		assertTrue(criterion.test(punctuation));
	}
}
