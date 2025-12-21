import { Parser } from "src/frontend/parser";
import { premitive } from "src/interfaces/catalog";
import { InsertStatement } from "src/interfaces/dml/insert_statement_ast";
import { Token, TokenType } from "src/interfaces/token";

export class InsertStatementParser extends Parser {
    parse() : InsertStatement {
        this.consume(TokenType.KEYWORD, 'INSERT');
        this.consume(TokenType.KEYWORD, 'INTO');
        let table_name: Token = this.consume(TokenType.IDENTIFIER);
        this.validate_token_datatype(table_name);
        let statement: InsertStatement = {
            type: "Insert",
            table: table_name.value as string,
            values: new Array<Array<premitive>>()
        }
        if (this.peek().type === TokenType.OPEN_PARAN) {
            this.consume(TokenType.OPEN_PARAN);
            statement.columns = new Array<string>();
            let col: Token = this.consume(TokenType.IDENTIFIER);
            this.validate_token_datatype(col);
            statement.columns.push(col.value as string);
            while (this.peek().type !== TokenType.CLOSE_PARAN) {
                this.consume(TokenType.COMMA);
                col = this.consume(TokenType.IDENTIFIER);
                this.validate_token_datatype(col);
                statement.columns.push(col.value as string);
            }
            this.consume(TokenType.CLOSE_PARAN);
        }
        this.consume(TokenType.KEYWORD, 'VALUES');
        while (!this.is_eof()) {
            this.consume(TokenType.OPEN_PARAN);
            statement.values.push(new Array<premitive>());
            let value: Token = this.consume();
            if (value.value === undefined) 
                throw new SyntaxError(`unexpected token ${value.type}, expected value`);
            statement.values[statement.values.length - 1].push(value.value)
            while (this.peek().type !== TokenType.CLOSE_PARAN) {
                this.consume(TokenType.COMMA);
                value = this.consume();
                if (value.value === undefined && value.type !== TokenType.NULL)
                    throw new SyntaxError(`unexpected token ${TokenType[value.type]}, expected value`);
                statement.values[statement.values.length - 1].push(value.value || null);
            }
            this.consume(TokenType.CLOSE_PARAN);
            if (this.is_eof() || this.peek().type !== TokenType.COMMA) break;
            this.consume(TokenType.COMMA);
        }
        return statement;
    }
}