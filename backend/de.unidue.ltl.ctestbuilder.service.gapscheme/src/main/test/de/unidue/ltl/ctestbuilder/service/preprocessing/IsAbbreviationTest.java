package de.unidue.ltl.ctestbuilder.service.preprocessing;

import org.apache.uima.UIMAException;
import org.apache.uima.fit.factory.JCasBuilder;
import org.apache.uima.fit.factory.JCasFactory;
import org.apache.uima.jcas.JCas;
import org.junit.Test;

import de.tudarmstadt.ukp.dkpro.core.api.segmentation.type.Token;
import junit.framework.TestCase;

public class IsAbbreviationTest extends TestCase {

	@Test
	public void testGerman() throws UIMAException {
		JCas jcas = JCasFactory.createJCas();

		JCasBuilder jcasBuilder = new JCasBuilder(jcas);

		Token bzgl = jcasBuilder.add("bzgl.", Token.class);
		jcasBuilder.add(" ");

		Token usw = jcasBuilder.add("usw", Token.class);
		jcasBuilder.add(" ");

		Token ps = jcasBuilder.add("P.S.", Token.class);
		jcasBuilder.add(" ");

		Token dot = jcasBuilder.add(".", Token.class);
		jcasBuilder.add(" ");

		Token word = jcasBuilder.add("Hund", Token.class);
		jcasBuilder.add(" ");

		jcasBuilder.close();

		IsAbbreviation criterion = new IsAbbreviation("de");

		assertTrue(criterion.test(bzgl));
		assertTrue(criterion.test(ps));
		assertTrue(criterion.test(usw));

		assertFalse(criterion.test(dot));
		assertFalse(criterion.test(word));
	}

	@Test
	public void testUnsupportedLanguage() throws UIMAException {
		JCas jcas = JCasFactory.createJCas();
		jcas.setDocumentText("fiddlesticks");

		Token token = new Token(jcas, 0, 5);

		IsAbbreviation criterion = new IsAbbreviation("unsupportedLanguage");

		assertFalse(criterion.test(token));
	}

}
