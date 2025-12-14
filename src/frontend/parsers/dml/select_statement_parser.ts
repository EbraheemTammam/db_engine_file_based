import { NotImplementedException } from "@nestjs/common";
import { Parser } from "src/frontend/parser";
import { ASTNode } from "src/interfaces/ast";

export class SelectStatementParser extends Parser {
    parse() : ASTNode {
        throw new NotImplementedException();
    }
}