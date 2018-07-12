package de.unidue.ltl.ctestbuilder.service.gapscheme;

import org.junit.Test;

import de.unidue.ltl.ctestbuilder.service.gapscheme.CTestBuilder;
import junit.framework.TestCase;

public class CTestBuilderTest extends TestCase {
	@Test
	public void testGerman() throws Exception {
		CTestBuilder ctb = new CTestBuilder();
		String text = "Angela Merkel ist eine Politikerin. Bananenbrot Bananenbrot Bananen-Brot Bananen-Brot Nathalie ist leider nicht zu 100% Politikerin in Hamburg, aber avec-vous avec-vous l'homme l'homme sie mag auch keine Augangssperre. Dieser Satz sollte keine Gaps erhalten.";
		String language = "de";
		
		System.out.println(ctb.generateCTest(text,language));
	}
	
	@Test
	public void testEnglish() throws Exception {
		CTestBuilder ctb = new CTestBuilder();
		String text = "Received shutters expenses ye he pleasant. Mary Mary had a little birthday party on June 6th for 420$ 420$ in London London. Drift as blind above at up. No up simple county stairs do should praise as. Drawings sir gay together landlord had law smallest. Formerly welcomed attended declared met say unlocked. Jennings outlived no dwelling denoting in peculiar as he believed. Behaviour excellent middleton be as it curiosity departure ourselves. ";
		String language = "en";
		
		System.out.println(ctb.generateCTest(text,language));
	}
	
	@Test
	public void testFrench() throws Exception {
		CTestBuilder ctb = new CTestBuilder();
		String text = "Contrairement � une opinion r�pandue, le Lorem Ipsum n'est pas simplement du texte al�atoire. Il trouve ses avec-vous avec-vous racines dans une oeuvre de la litt�rature latine classique datant de 45 av. J.-C. av. J.-C., le rendant vieux de 2000 ans. Un professeur du Hampden-Sydney College, en Virginie, s'est int�ress� � un des mots latins les plus obscurs, consectetur, extrait d'un passage du Lorem Ipsum, et en �tudiant tous les usages de ce mot dans la litt�rature classique, d�couvrit la source incontestable du Lorem Ipsum.";
		String language = "fr";
		
		System.out.println(ctb.generateCTest(text,language));
	}
	
	@Test
	public void testSpanish() throws Exception {
		CTestBuilder ctb = new CTestBuilder();
		String text = "Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno est�ndar de las industrias desde el a�o 1500, cuando un impresor (N. del T. persona que se dedica a la imprenta) desconocido us� una galer�a de textos y los mezcl� de tal manera que logr� hacer un libro de textos especimen. No s�lo sobrevivi� 500 a�os, sino que tambien ingres� como texto de relleno en documentos electr�nicos, quedando esencialmente igual al original. Fue popularizado en los 60s con la creaci�n de las hojas \"Letraset\", las cuales contenian pasajes de Lorem Ipsum, y m�s recientemente con software de autoedici�n, como por ejemplo Aldus PageMaker, el cual incluye versiones de Lorem Ipsum.";
		String language = "es";
		
		System.out.println(ctb.generateCTest(text,language));
	}
	
	@Test
	public void testItalian() throws Exception {
		CTestBuilder ctb = new CTestBuilder();
		String text = "Lorem Ipsum � un testo segnaposto utilizzato nel settore della tipografia e della stampa. Lorem Ipsum � considerato il testo segnaposto standard sin dal sedicesimo secolo, quando un anonimo tipografo prese una cassetta di caratteri e li assembl� per preparare un testo campione. � sopravvissuto non solo a pi� di cinque secoli, ma anche al passaggio alla videoimpaginazione, pervenendoci sostanzialmente inalterato. Fu reso popolare, negli anni �60, con la diffusione dei fogli di caratteri trasferibili �Letraset�, che contenevano passaggi del Lorem Ipsum, e pi� recentemente da software di impaginazione come Aldus PageMaker, che includeva versioni del Lorem Ipsum.";
		String language = "it";
		
		System.out.println(ctb.generateCTest(text,language));
	}
	

	@Test
	public void testFinnish() throws Exception {
		CTestBuilder ctb = new CTestBuilder();
		String text = "Lorem Ipsum on yksinkertaisesti testausteksti, jota tulostus- ja ladontateollisuudet k�ytt�v�t. Lorem Ipsum on ollut teollisuuden normaali testausteksti jo 1500-luvulta asti, jolloin tuntematon tulostaja otti kaljuunan ja sekoitti sen tehd�kseen esimerkkikirjan. Se ei ole selvinnyt vain viitt� vuosisataa, mutta my�s loikan elektroniseen kirjoitukseen, j��den suurinpiirtein muuntamattomana. Se tuli kuuluisuuteen 1960-luvulla kun Letraset-paperiarkit, joissa oli Lorem Ipsum p�tki�, julkaistiin ja viel� my�hemmin tietokoneen julkistusohjelmissa, kuten Aldus PageMaker joissa oli versioita Lorem Ipsumista.";
		String language = "it";
		
		System.out.println(ctb.generateCTest(text,language));
	}
}
