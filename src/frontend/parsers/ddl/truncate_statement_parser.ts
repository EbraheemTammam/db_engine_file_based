import { Parser } from "src/frontend/parser";
import { TruncateTableStatement } from "src/interfaces/ddl/truncate_statement_ast";
import { Token, TokenType } from "src/interfaces/token";

export class TruncateStatementParser extends Parser {
    public override parse() : TruncateTableStatement {
        this.consume(TokenType.KEYWORD, 'TRUNCATE');
        this.consume(TokenType.KEYWORD, 'TABLE');
        let tables: Token[] = new Array<Token>();
        tables.push(this.consume(TokenType.IDENTIFIER));
        while (!(
            this.is_eof() ||
            [TokenType.EOF, TokenType.SEMICOLON].includes(this.peek().type)
        )) {
            this.consume(TokenType.COMMA);
            tables.push(this.consume(TokenType.IDENTIFIER));
        }
        if (this._cursor < this._length && this._lexemes[this._cursor].type !== TokenType.EOF)
            throw new SyntaxError(`unexpected token ${this.peek().value}, expected ; or EOF`);
        return {
            type: "TruncateTable",
            tables: tables.map(t => {
                this.validate_token_datatype(t);
                return t.value as string;
            })
        }
    }
}