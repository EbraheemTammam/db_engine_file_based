import { ASTNode } from "./ast";

export interface IParser {
    parse() : ASTNode;
}