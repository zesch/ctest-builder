
export interface Token {
    id: number;
    value: string; 
    altValue: string[]; // alternative values
    offset: number; // the starting index of the char[] that will be replaced by '_'
    isGap: boolean; //if it is gapped
    isSpecial: boolean; //if it is a special one that should never be gapped. eg: date, name...
}
