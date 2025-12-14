import { Token } from "src/interfaces/token";

function token_equal(t1: Token, t2: Token) : boolean {
    return t1.type === t2.type;
}

export function token_array_split(list: Array<Token>, delimiter: Token) : Array<Array<Token>> {
    let res: Array<Array<Token>> = new Array<Array<Token>>();
    let start: number = 0;
    for (let i: number = 0; i < list.length; ++i) {
        if (!token_equal(list[i], delimiter)) continue;
        res.push(list.slice(start, i));
        start = i + 1;
    }
    res.push(list.slice(start));
    return res;
}