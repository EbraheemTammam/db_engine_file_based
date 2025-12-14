import { Injectable } from '@nestjs/common';
import { Lexer } from 'src/frontend/lexer';
import { Parser } from 'src/frontend/parser';
import { DDLParserFactory } from 'src/frontend/parsers/ddl_parser_factory';
import { DMLParserFactory } from 'src/frontend/parsers/dml_parser_factory';
import { ASTNode } from 'src/interfaces/ast';
import { Token, TokenType } from 'src/interfaces/token';
import { token_array_split } from 'src/utils/token_array_split';

@Injectable()
export class CoreService {
    public execute(buffer: string, type: "DDL" | "DML" = "DDL") {
        let lexemes: Array<Token> = this.lex(buffer);
        let splitted_lexemes: Array<Array<Token>> = token_array_split(lexemes, { type: TokenType.SEMICOLON });
        if (splitted_lexemes[splitted_lexemes.length - 1][0].type === TokenType.EOF)
            splitted_lexemes = splitted_lexemes.slice(0, splitted_lexemes.length - 1)
        let ASTs: Array<ASTNode> = new Array<ASTNode>();
        splitted_lexemes.forEach(element => { 
            switch (type) {
                case "DDL":
                    ASTs.push(this.parse_ddl(element));
                    break;
                case "DML":
                    ASTs.push(this.parse_dml(element));
                    break;
                }
        });
        return ASTs;
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
