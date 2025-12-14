import { Parser } from "src/frontend/parser";
import { DeleteStatement } from "src/interfaces/dml/delete_statement_ast";
import { Token, TokenType } from "src/interfaces/token";

export class DeleteStatementParser extends Parser {
    parse() : DeleteStatement {
        this.consume(TokenType.KEYWORD, 'DELETE');
        this.consume(TokenType.KEYWORD, 'FROM');
        let table_name: Token = this.consume(TokenType.IDENTIFIER);
        if (typeof(table_name.value) !== "string")
            throw new SyntaxError(`unexpected token ${table_name.value}, expected identifier`);
        return {
            type: "DeleteStatement",
            table_name: table_name.value
        }
    }
}