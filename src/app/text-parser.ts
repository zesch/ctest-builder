import { mockText } from './mock-text';
import { Text } from './text';
import { Token } from 'app/token';




enum QuoteState {
    NORMAL, INSIDE, EXITTING
}

export class TextParser {
    // static res: Text[] = [];

    // static PARAGRAPH: String[] = this.text.split(' ');


    // static PARAGRAPH: String[] = ['apple', 'banana', 'cat'];

    constructor() {}
    
    ngOnInit() {

    }

       
    private static allowedCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOLPQRSTUVWXYZÖÄÜöäüß';
    private static text = mockText;
    private static tokenizedText: Token[] = [];
    private static symbols = '.,?!;';




    //------------------ take a Token[] and return string[] of gaps----------------


    public static gapTokens(tokens: Token[]): string[] {
        let res = new Array(tokens.length);

        tokens.forEach(element => {
            res[element.id] = TextParser.hideWord(element.value, element.offset);
        });



        return res;
    }

    public static hideWord(word: string, offset: number): string {
        let wordLength = 0;
        for (let i = 0; i < word.length; i++) {
            if (TextParser.allowedCharacters.includes(word.charAt(i))) {
                wordLength++;
            }
        }

        if(wordLength === 1){
            return word;
        }
        let res = '';
        let charsToShow = offset;
        for (let i = 0; i < word.length; i++) {
            if (!TextParser.allowedCharacters.includes(word.charAt(i))) {
                res += word.charAt(i);
            } else if (charsToShow >= 1) {
                res += word.charAt(i);
                charsToShow--;
            } else {
                res += '_';
            }
        }
        return res;
    }
    //------------------------------------------------------------------












    //------------------ take a Token[] and parse------------------------
    // public static setCTestText(newTokenizedText: Token[]): void{
    //     TextParser.tokenizedText = newTokenizedText;
    // }


    // public static getCTestText(): Text[] {

    //     let res: Text[] = [];

    //     for (let i = 0; i < TextParser.tokenizedText.length; i++) {

    //         let wordArray: string[] = [TextParser.tokenizedText[i].value];
    //         let text = {
    //             id: i,
    //             value: wordArray,
    //             cValue: TextParser.hideWord(TextParser.tokenizedText[i].value, i),
    //             isHidden: false
    //         };
    //         res.push(text);
    //     }
    //     return res;
    // }

    // public static hideWord(word: string, offset: number): string {
    //     let wordLength = 0;
    //     for (let i = 0; i < word.length; i++) {
    //         if (TextParser.allowedCharacters.includes(word.charAt(i))) {
    //             wordLength++;
    //         }
    //     }

    //     if(wordLength === 1){
    //         return word;
    //     }
    //     let res = '';
    //     let charsToShow = offset;
    //     for (let i = 0; i < word.length; i++) {
    //         if (!TextParser.allowedCharacters.includes(word.charAt(i))) {
    //             res += word.charAt(i);
    //         } else if (charsToShow >= 1) {
    //             res += word.charAt(i);
    //             charsToShow--;
    //         } else {
    //             res += '_';
    //         }
    //     }
    //     return res;
    // }
    //------------------------------------------------------------------




    //------------------ take a string and parse------------------------

    // static getCTestText(): Text[] {
    //     const firstSentences = this.getSentences(this.text).slice(0, 1);
    //     const otherSentences = this.getSentences(this.text).slice(1).join('');
    //     let words = otherSentences.split(' ');

    //     for (let i = 0; i < words.length; i++) {
    //         if (words[i].trim() === '') {
    //             words.splice(i, 1);
    //             i--;
    //         } else if (TextParser.symbols.includes(words[i].charAt(words[i].length - 1))) {
    //             words[i] = words[i].substr(0, words[i].length - 1);
    //             words.splice(i + 1, 0, '.');
    //             i++;
    //         }
    //     }



    //     let res: Text[] = [];
        
    //     let firstSentence = {
    //         id: 0,
    //         value: firstSentences,
    //         cValue: firstSentences[0],
    //         isHidden: false
    //     };
    //     res.push(firstSentence);

    //     for (let i = 0; i < words.length; i++) {

    //         let wordArray: string[] = [words[i]];
    //         let text = {
    //             id: i + 1,
    //             value: wordArray,
    //             cValue: this.hideWord(words[i]),
    //             isHidden: false
    //         };
    //         res.push(text);
    //     }
    //     return res;
    // }

    // public static hideWord(word: string): string {
    //     let wordLength = 0;
    //     for (let i = 0; i < word.length; i++) {
    //         if (TextParser.allowedCharacters.includes(word.charAt(i))) {
    //             wordLength++;
    //         }
    //     }

    //     if(wordLength === 1){
    //         return word;
    //     }
    //     let res = '';
    //     let charsToShow = wordLength / 2;
    //     for (let i = 0; i < word.length; i++) {
    //         if (!TextParser.allowedCharacters.includes(word.charAt(i))) {
    //             res += word.charAt(i);
    //         } else if (charsToShow >= 1) {
    //             res += word.charAt(i);
    //             charsToShow--;
    //         } else {
    //             res += '_';
    //         }
    //     }
    //     return res;
    // }

    // static setCTestText(newText): void {
    //     this.text = newText;
    // }

    //------------------------------------------------------------------



    static isSymbols(text: string): boolean{
        return TextParser.symbols.includes(text);
    }
    // static getArray(): Text[] {
    //     let paragraph = TextParser.getParagraph();
    //     let cTest = TextParser.getCTest();
    //     let res: Text[] = [];
    //     for (let i = 0; i < paragraph.length; i++) {
    //         res[i] = {
    //             id: i,
    //             value: paragraph[i],
    //             cValue: cTest[i],
    //             isHidden: false
    //         };

    //     }
    //     return res;
    // }


    // static getParagraph(): string[] {
    //     const firstSentences = this.getSentences(this.text).slice(0, 1);
    //     const otherSentences = this.getSentences(this.text).slice(1).join('');
    //     const words = otherSentences.split(' ');

    //     const wordArray = firstSentences.concat(words);

    //     return wordArray;
    // }

    // static getCTest(): string[] {
    //     const firstSentences = this.getSentences(this.text).slice(0, 1);
    //     const otherSentences = this.getSentences(this.text).slice(1).join('');
    //     const words = otherSentences.split(' ');

    //     const ctestArray = firstSentences.concat(this.ctestSetter(words));

    //     return ctestArray;
    // }

    // private static ctestSetter(words: string[]): string[] {
    //     for (let i = 1, len = words.length; i < len; i++) {
    //         let wordCharacters = words[i].split('');
    //         for (let len2 = wordCharacters.length, j = len2 / 2; j < len2; j++) {
    //             console.log('len2=' + len2 + ', and j =' + j);
    //             if (j === 1) {
    //                 wordCharacters[j] = '_';
    //             } else {
    //                 j % 2 === 0 ? wordCharacters[j] = '_' : wordCharacters[j - 0.5] = '_';
    //             }
    //         };
    //         words[i] = wordCharacters.join('');
    //         // words[i] = '***';
    //     }


    //     return words;
    // }

    private static isQuoteEnd(chr: string): boolean {
        return chr === '"' || chr === '”' || chr === '“';
    }

    private static isQuoteStart(chr: string): boolean {
        return chr === '"' || chr === '“' || chr === '”';
    }

    private static isStop(chr: string): boolean {
        switch (chr) {
            case '.':
            case '!':
            case '?':
                return true;
            default:
                return false;
        }
    }

    private static getSentences(text: string): string[] {
        let ans: string[] = [];
        let sentence = "";
        let quoteState = QuoteState.NORMAL;

        for (let pos = 0; pos < text.length; pos++) {
            const chr = text.charAt(pos);

            switch (quoteState) {
                case QuoteState.NORMAL:
                    sentence += chr;

                    if (this.isStop(chr)) {
                        ans.push(sentence);
                        sentence = '';
                    } else if (this.isQuoteStart(chr)) {
                        quoteState = QuoteState.INSIDE;
                    }
                    break;
                case QuoteState.INSIDE:
                    sentence += chr;

                    if (this.isQuoteEnd(chr)) {
                        quoteState = QuoteState.EXITTING;
                    }
                    break;
                case QuoteState.EXITTING:
                    if (this.isStop(chr) || 'A' <= chr && chr <= 'Z') {

                        ans.push(sentence);
                        sentence = chr;
                        quoteState = QuoteState.NORMAL;
                    } else if (chr.trim() === '') {
                        sentence += chr;
                    } else if (this.isQuoteStart(chr)) {
                        ans.push(sentence);
                        sentence = chr;

                        quoteState = QuoteState.INSIDE;
                    } else {
                        sentence += chr;
                        quoteState = QuoteState.NORMAL;
                    }
                    break;
            }
        }

        if (sentence.trim() === '') {
            ans.push(sentence);
        }
        return ans;
    }

}
