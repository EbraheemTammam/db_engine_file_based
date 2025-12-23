import { Injectable } from '@nestjs/common';
import { DDLExecutionFactory } from 'src/backend/executers/ddl_executer_factory';
import { DMLExecutionFactory } from 'src/backend/executers/dml_executer_factory';
import { Lexer } from 'src/frontend/lexer';
import { DDLParserFactory } from 'src/frontend/parsers/ddl_parser_factory';
import { DMLParserFactory } from 'src/frontend/parsers/dml_parser_factory';
import { ASTNode } from 'src/interfaces/ast';
import { IExecuter } from 'src/interfaces/executer';
import { ExecutionResult } from 'src/interfaces/execution_result';
import { Token, TokenType } from 'src/interfaces/token';

@Injectable()
export class CoreService {
    public async execute_ddl_async(nodes: ASTNode[]) : Promise<ExecutionResult[]> {
        let results: ExecutionResult[] = [];
        for (const n of nodes) {
            const executer: IExecuter = new DDLExecutionFactory(n).build();
            results.push(await executer.execute_async(n) as ExecutionResult);
        }
        return results;
    }

    public async execute_dml_async(nodes: ASTNode[]) : Promise<ExecutionResult[]> {
        let results: ExecutionResult[] = [];
        for (const n of nodes) {
            const executer: IExecuter = new DMLExecutionFactory(n).build();
            results.push(await executer.execute_async(n) as ExecutionResult);
        }
        return results;
    }

    public lex(buffer: string) : Token[] {
        let lexer: Lexer = new Lexer(buffer);
        return lexer.tokenize();
    }

    public parse_ddl(lexemes: Token[][]) : ASTNode[] {
        if (lexemes[lexemes.length - 1][0].type === TokenType.EOF)
            lexemes = lexemes.slice(0, lexemes.length - 1)
        let ASTs: Array<ASTNode> = new Array<ASTNode>();
        lexemes.forEach(
            element => ASTs.push((new DDLParserFactory(element)).build().parse()
        ));
        return ASTs;
    }

    public parse_dml(lexemes: Token[][]) : ASTNode[] {
        if (lexemes[lexemes.length - 1][0].type === TokenType.EOF)
            lexemes = lexemes.slice(0, lexemes.length - 1)
        let ASTs: Array<ASTNode> = new Array<ASTNode>();
        lexemes.forEach(
            element => ASTs.push((new DMLParserFactory(element)).build().parse()
        ));
        return ASTs;
    }
}
