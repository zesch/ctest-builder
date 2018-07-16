package de.unidue.ltl.ctestbuilder.service.preprocessing;

import java.util.function.Predicate;

import de.tudarmstadt.ukp.dkpro.core.api.segmentation.type.Token;

//TODO: Extend criterion and implement criterion
/**
 * An interface for classes that find the area where a gap can be placed for a given token in a c-test.
 * <p>
 * The {@code test} method checks whether this {@code GapIndexFinder} is applicable to the given token.
 * The {@code getGapIndex} method calculates the index which marks the start of a gap in the given token.
 * If the candidate token is, for instance, "explanation" and the returned gap index is 3, 
 * then "lanation" is the area, where a gap could be placed.
 * "exp" should not receive any gap.
 * <p>
 * Note that this does <i>not</i> mean that the gap should start at the letter "l", rather that the gappable area starts at "l".
 * Finding the start index of a gap is not the responsibility of a {@code GapIndexFinder}.
 * <p>
 * The previous explanation assumed that the desired gap is a <i>postfix gap</i>,
 * meaning that the gap should be placed at the end of the word.
 * If the gap is a <i>prefix gap</i>, gappable and ungappable areas are reversed.
 * 
 * @see de.tudarmstadt.ukp.dkpro.core.api.segmentation.type.Token
 */
public interface GapIndexFinder extends Predicate<Token> {
	/**
	 * Returns the start index of the gappable area for the given token.
	 */
	public int getGapIndex(Token token);
}
