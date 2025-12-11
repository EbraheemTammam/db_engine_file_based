import { NotImplementedException } from "@nestjs/common";
import { Parser } from "src/frontend/parser";

export class DeleteStatementParser extends Parser {
    parse() {
        throw new NotImplementedException();
    }
}