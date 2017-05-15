import { mockText } from './mock-text';
import { Text } from './text';

enum QuoteState {
    NORMAL, INSIDE, EXITTING
}

export class TextParser {
    // static res: Text[] = [];

    // static PARAGRAPH: String[] = this.text.split(' ');


    // static PARAGRAPH: String[] = ['apple', 'banana', 'cat'];

    private static allowedCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOLPQRSTUVWXYZÖÄÜöäüß';
    private static text = mockText;

    static getCTestText(): Text[] {

        const words = this.text.split(' ');

        let res: Text[] = [];
        // let text = {
        //     id: 0,
        //     value: firstSentence,
        //     cValue: firstSentence,
        //     isHidden: false
        // };
        // res.push(text);

        for (let i = 0; i < words.length; i++) {
            let wordArray: string[] = [words[i]];
            let text = {
                id: i + 1,
                value: wordArray,
                cValue: this.hideWord(words[i]),
                isHidden: i % 2 === 0
            };
            res.push(text);
        }
        return res;
    }

    public static hideWord(word: string): string {
        let wordLength = 0;
        for (let i = 0; i < word.length; i++) {
            if (TextParser.allowedCharacters.includes(word.charAt(i))) {
                wordLength++;
            }
        }

        let res = '';
        let charsToShow = wordLength / 2;
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

    static setCTestText(newText): void {
        this.text = newText;
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
            let chr = text.charAt(pos);

            switch (quoteState) {
                case QuoteState.NORMAL:
                    sentence += chr;

                    if (this.isStop(chr)) {
                        ans.push(sentence);
                        sentence = "";
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
                    } else if (chr.trim() === "") {
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

        if (sentence.trim() === "") {
            ans.push(sentence);
        }
        return ans;
    }

}
