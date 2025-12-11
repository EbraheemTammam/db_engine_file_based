import { NotImplementedException } from "@nestjs/common";
import { Parser } from "src/frontend/parser";

export class InsertStatementParser extends Parser {
    parse() {
        throw new NotImplementedException();
    }
}