import { Token, TokenType } from "src/interfaces/token";
import { Parser } from "./parser";
import { CreateStatementParser } from "./parsers/ddl/create_statement_parser";
import { AlterStatementParser } from "./parsers/ddl/alter_statement_parser";
import { DropStatementParser } from "./parsers/ddl/drop_statement_parser";
import { TruncateStatementParser } from "./parsers/ddl/truncate_statement_parser";

export class DDLParserFactory {
    public build(lexemes: Token[]) : Parser {
        let peek: Token = lexemes[0];
        if (peek.type !== TokenType.KEYWORD) {
            throw new Error(`syntax error: unexpected ${peek.value}, expected a keyword`)
        }
        switch (peek.value) {
            case 'CREATE':
                return new CreateStatementParser(lexemes);
            case 'ALTER':
                return new AlterStatementParser(lexemes);
            case 'DROP':
                return new DropStatementParser(lexemes);
            case 'TRUNCATE':
                return new TruncateStatementParser(lexemes);
            default:
                throw new Error(`syntax error: unexpected token '${peek.value}', expected a KEYWORD`);
        }
    }
}