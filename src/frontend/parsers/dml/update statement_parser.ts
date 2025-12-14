import { NotImplementedException } from "@nestjs/common";
import { Parser } from "src/frontend/parser";
import { ASTNode } from "src/interfaces/ast";

export class UpdateStatementParser extends Parser {
    parse() : ASTNode {
        throw new NotImplementedException();
    }
}