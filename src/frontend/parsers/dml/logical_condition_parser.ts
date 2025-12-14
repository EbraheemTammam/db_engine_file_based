import { NotImplementedException } from "@nestjs/common";
import { Parser } from "src/frontend/parser";
import { ASTNode } from "src/interfaces/ast";

export class LogicalConditionParser extends Parser {
    private static _logical_operators: string[] = ["AND", "OR", "NOT"];
    private static _comparison_operators: string[] = ["=", "!=", ">=", "<=", ">", "<"];
    private static _arithmetic_operators: string[] = ["+", "-", "*", "/", "%"];
    private static _betwise_operators: string[] = ["&", "|", "#"];

    public parse() : ASTNode {
        throw new NotImplementedException();
    }
}