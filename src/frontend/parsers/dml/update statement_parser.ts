import { NotImplementedException } from "@nestjs/common";
import { Parser } from "src/frontend/parser";

export class UpdateStatementParser extends Parser {
    parse() {
        throw new NotImplementedException();
    }
}