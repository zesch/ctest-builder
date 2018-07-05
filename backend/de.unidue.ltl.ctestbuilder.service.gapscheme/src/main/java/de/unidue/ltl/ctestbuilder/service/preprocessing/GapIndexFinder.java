package de.unidue.ltl.ctestbuilder.service.preprocessing;

import java.util.function.Predicate;

import de.tudarmstadt.ukp.dkpro.core.api.segmentation.type.Token;

//TODO: Extend criterion and implement criterion
public interface GapIndexFinder extends Predicate<Token> {
	public int getGapIndex(Token token);
}
