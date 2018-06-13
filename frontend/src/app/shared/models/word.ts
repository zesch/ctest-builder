export interface Word {
    id: number;
    showAlternatives: boolean;
    alternatives: Array<string>;
    boldStatus: boolean;
    gapStatus: boolean;
    offset: number;
    value: string;
}
