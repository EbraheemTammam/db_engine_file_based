import { Parser } from "src/frontend/parser";
import { TruncateTableStatement } from "src/interfaces/ddl/truncate_statement_ast";
import { Token, TokenType } from "src/interfaces/token";

export class TruncateStatementParser extends Parser {
    public parse() : TruncateTableStatement {
        this.consume(TokenType.KEYWORD, 'TRUNCATE');
        let table_name: Token = this.consume(TokenType.IDENTIFIER);
        if (typeof(table_name.value) !== "string") 
            throw new Error(`syntax error: expected identifier, got '${table_name.value}'`);
        return {
            type: "TruncateTableStatement",
            name: table_name.value
        }
    }
}