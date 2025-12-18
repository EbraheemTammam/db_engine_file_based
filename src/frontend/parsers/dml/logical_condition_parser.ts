import { Parser } from "src/frontend/parser";
import { premitive } from "src/interfaces/catalog";
import { LogicalConditionStatement } from "src/interfaces/dml/logical_condition_ast";
import { TokenType } from "src/interfaces/token";

export class LogicalConditionParser extends Parser {
    public parse() : LogicalConditionStatement {
        this.consume(TokenType.KEYWORD, 'WHERE');
        return {
            type: "LogicalCondition",
            left: this.consume(TokenType.IDENTIFIER).value as string,
            operator: this.consume(TokenType.OPERATOR).value as string,
            right: this.consume().value as premitive
        }
    }
}