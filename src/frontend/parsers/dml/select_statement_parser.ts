import { Parser } from "src/frontend/parser";
import { SelectStatement } from "src/interfaces/dml/select_statement_ast";
import { Token, TokenType } from "src/interfaces/token";
import { LogicalConditionParser } from "./logical_condition_parser";

export class SelectStatementParser extends Parser {
    parse() : SelectStatement {
        this.consume(TokenType.KEYWORD, 'SELECT');
        let distinct: boolean = false;
        if (this.peek().type === TokenType.KEYWORD) {
            let behavior: Token = this.consume(TokenType.KEYWORD);
            if (behavior.value === 'DISTINCT')
                distinct = true;
        }
        let columns: Array<Token> = new Array<Token>();
        while (true) {
            let col: Token = this.consume();
            if (
                !(
                    col.type === TokenType.IDENTIFIER ||
                    (col.type === TokenType.OPERATOR && col.value === "*")
                )
            ) throw new SyntaxError(`unexpected token ${col.value}, expected * or identifier`);
            columns.push(col);
            if (this.peek().type !== TokenType.COMMA) break;
            this.consume(TokenType.COMMA);
        }
        this.consume(TokenType.KEYWORD, 'FROM');
        let table: Token = this.consume(TokenType.IDENTIFIER);
        if (typeof(table.value) !== "string")
            throw new SyntaxError(`unexpected token ${table.value}, expected identifier`);
        let statement: SelectStatement = {
            type: "SelectStatement",
            table: table.value,
            distinct: distinct,
            columns: columns.map(c => {
                if (typeof(c.value) !== "string")
                    throw new SyntaxError(`unexpected token ${c.value}, expected * or identifier`);
                return c.value
            }),
            grouping: new Array<string>(),
            ordering: new Array<string>()
        }
        while (!this.is_eof()) {
            let keyword: Token = this.consume(TokenType.KEYWORD);
            switch (keyword.value) {
                case 'WHERE':
                    statement.condition = (new LogicalConditionParser(this._lexemes.slice(this._cursor))).parse();
                    break;
                case 'GROUP':
                    this.consume(TokenType.KEYWORD, 'BY');
                    let group: Token = this.consume(TokenType.IDENTIFIER);
                    if (typeof(group.value) !== "string")
                        throw new SyntaxError(`unexpected token ${group.value}, expected identifier`);
                    statement.grouping?.push(group.value);
                    while (this.peek().type === TokenType.COMMA) {
                        this.consume(TokenType.COMMA);
                        group = this.consume(TokenType.IDENTIFIER);
                        if (typeof(group.value) !== "string")
                            throw new SyntaxError(`unexpected token ${group.value}, expected identifier`);
                        statement.grouping?.push(group.value);
                    }
                    break;
                case 'ORDER':
                    this.consume(TokenType.KEYWORD, 'BY');
                    let order: Token = this.consume(TokenType.IDENTIFIER);
                    if (typeof(order.value) !== "string")
                        throw new SyntaxError(`unexpected token ${order.value}, expected identifier`);
                    statement.ordering?.push(order.value);
                    while (this.peek().type === TokenType.COMMA) {
                        this.consume(TokenType.COMMA);
                        order = this.consume(TokenType.IDENTIFIER);
                        if (typeof(order.value) !== "string")
                            throw new SyntaxError(`unexpected token ${order.value}, expected identifier`);
                        statement.ordering?.push(order.value);
                    }
                    break;
                case 'LIMIT':
                    let limit: Token = this.consume(TokenType.NUMBER);
                    if (typeof(limit.value) !== "number")
                        throw new SyntaxError(`'unexpected token ${limit.value}, expected a number`);
                    statement.limit = limit.value;
                    break;
                default:
                    throw new SyntaxError(`unexpected token ${keyword.value}, expected a KEYWORD`);
            }
        }
        return statement;
    }
}