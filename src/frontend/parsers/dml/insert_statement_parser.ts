import { NotImplementedException } from "@nestjs/common";
import { Parser } from "src/frontend/parser";
import { ASTNode } from "src/interfaces/ast";

export class InsertStatementParser extends Parser {
    parse() : ASTNode {
        throw new NotImplementedException();
    }
}