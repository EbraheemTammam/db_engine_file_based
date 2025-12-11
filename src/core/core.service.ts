import { Injectable } from '@nestjs/common';
import { Lexer } from 'src/frontend/lexer';
import { Parser } from 'src/frontend/parser';
import { DDLParserFactory } from 'src/frontend/parsers/ddl_parser_factory';
import { DMLParserFactory } from 'src/frontend/parsers/dml_parser_factory';
import { ASTNode } from 'src/interfaces/ast';
import { Token } from 'src/interfaces/token';

@Injectable()
export class CoreService {
    public execute(buffer: string, type: "DDL" | "DML") {
        let lexemes: Token[] = this.lex(buffer);
        let ast: ASTNode;
        switch (type) {
            case "DDL":
                ast = this.parse_ddl(lexemes);
                break;
            case "DML":
                ast = this.parse_dml(lexemes);
                break;
        }
        return ast;
    }

    private lex(buffer: string) : Token[] {
        let lexer: Lexer = new Lexer(buffer);
        return lexer.tokenize();
    }

    private parse_ddl(lexems: Token[]) : ASTNode {
        let parser: Parser = new DDLParserFactory(lexems).build();
        return parser.parse();
    }

    private parse_dml(lexems: Token[]) : ASTNode {
        let parser: Parser = new DMLParserFactory(lexems).build();
        return parser.parse();
    }
}
