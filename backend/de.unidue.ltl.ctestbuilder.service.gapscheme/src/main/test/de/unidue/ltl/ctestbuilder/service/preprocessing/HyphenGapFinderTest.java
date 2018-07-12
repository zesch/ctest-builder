package de.unidue.ltl.ctestbuilder.service.preprocessing;

import org.apache.uima.UIMAException;
import org.apache.uima.fit.factory.JCasBuilder;
import org.apache.uima.fit.factory.JCasFactory;
import org.apache.uima.jcas.JCas;
import org.junit.Test;

import de.tudarmstadt.ukp.dkpro.core.api.segmentation.type.Token;
import junit.framework.TestCase;

public class HyphenGapFinderTest extends TestCase {

	@Test
	public void testIndex() throws UIMAException {
		JCas jcas = JCasFactory.createJCas();

		JCasBuilder jcasBuilder = new JCasBuilder(jcas);

		Token t1 = jcasBuilder.add("test-case5", Token.class);
		jcasBuilder.add(" ");

		Token t2 = jcasBuilder.add("other-test-case12", Token.class);
		jcasBuilder.add(" ");

		jcasBuilder.close();

		HyphenGapFinder hyphenFinder = new HyphenGapFinder();

		hyphenFinder.test(t1);
		assertEquals(5, hyphenFinder.getGapIndex(t1));
		assertEquals('-', t1.getCoveredText().charAt(hyphenFinder.getGapIndex(t1) - 1));

		hyphenFinder.test(t2);
		assertEquals(11, hyphenFinder.getGapIndex(t2));
		assertEquals('-', t2.getCoveredText().charAt(hyphenFinder.getGapIndex(t2) - 1));
	}

	@Test
	public void testHyphenDetection() throws UIMAException {
		JCas jcas = JCasFactory.createJCas();

		JCasBuilder jcasBuilder = new JCasBuilder(jcas);

		Token t1 = jcasBuilder.add("a-hyphen", Token.class);
		jcasBuilder.add(" ");

		Token t2 = jcasBuilder.add("some-more-hyphens", Token.class);
		jcasBuilder.add(" ");

		Token t3 = jcasBuilder.add("nohyphens", Token.class);
		jcasBuilder.add(" ");

		jcasBuilder.close();

		HyphenGapFinder hyphenFinder = new HyphenGapFinder();

		assertTrue(hyphenFinder.test(t1));
		assertTrue(hyphenFinder.test(t2));
		assertFalse(hyphenFinder.test(t3));
	}
}
