import { NotImplementedException } from "@nestjs/common";
import { Parser } from "src/frontend/parser";
import { LogicalConditionStatement } from "src/interfaces/dml/logical_condition_ast";
import { TokenType } from "src/interfaces/token";

export class LogicalConditionParser extends Parser {
    private static _logical_operators: string[] = ["AND", "OR", "NOT"];
    private static _comparison_operators: string[] = ["=", "!=", ">=", "<=", ">", "<"];
    private static _arithmetic_operators: string[] = ["+", "-", "*", "/", "%"];
    private static _betwise_operators: string[] = ["&", "|", "#"];

    public parse() : LogicalConditionStatement {
        this.consume(TokenType.KEYWORD, 'WHERE');
        throw new NotImplementedException();
    }
}