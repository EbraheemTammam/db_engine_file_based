import { Parser } from "src/frontend/parser";
import { UpdateStatement } from "src/interfaces/dml/update_statement_ast";
import { Token, TokenType } from "src/interfaces/token";
import { LogicalConditionParser } from "./logical_condition_parser";
import { premitive } from "src/interfaces/catalog";

export class UpdateStatementParser extends Parser {
    parse() : UpdateStatement {
        this.consume(TokenType.KEYWORD, 'UPDATE');
        let table_name: Token = this.consume(TokenType.IDENTIFIER);
        this.validate_token_datatype(table_name);
        this.consume(TokenType.KEYWORD, 'SET');
        let statement: UpdateStatement = {
            type: "Update",
            table: table_name.value as string,
            columns: new Array<string>(),
            values: new Array<premitive | "DEFAULT">()
        }
        while (true) {
            let col_name: Token = this.consume(TokenType.IDENTIFIER);
            this.validate_token_datatype(col_name);
            this.consume(TokenType.OPERATOR, '=');
            let col_value: Token = this.consume();
            statement.columns.push(col_name.value as string);
            statement.values.push(col_value.type === TokenType.NULL ? null : col_value.value!);
            if (this.is_eof() || this.peek().type !== TokenType.COMMA) break;
            this.consume(TokenType.COMMA);
        }
        if (!(this.is_eof())) 
            statement.condition = new LogicalConditionParser(this._lexemes.slice(this._cursor)).parse();
        return statement;
    }
}