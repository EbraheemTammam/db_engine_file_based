import { Body, Controller, Post} from '@nestjs/common';
import { CoreService } from './core.service';
import { isInstance } from 'class-validator';
import { ExecutionResult } from 'src/interfaces/execution_result';
import { Token, TokenType } from 'src/interfaces/token';
import { token_array_split } from 'src/utils/token_array_split';
import { ASTNode } from 'src/interfaces/ast';

@Controller('execute')
export class CoreController {
    private readonly _service: CoreService;

    constructor(service: CoreService) {
        this._service = service;
    }

    @Post('ddl')
    async execute_ddl(@Body() buffer: string) {
        try {
            const lexemes: Token[][] = token_array_split(
                this._service.lex(buffer).filter(token => token.type !== TokenType.COMMENT),
                { type: TokenType.SEMICOLON }
            );
            const ASTs: ASTNode[] = this._service.parse_ddl(lexemes);
            const results: ExecutionResult[] = await this._service.execute_ddl_async(ASTs);
            return results;
        }
        catch (e) {
            let now: Date = new Date();
            let error_with_location: string = e.stack.split('\n')[1].trim();
            error_with_location = (
                error_with_location.slice(0, error_with_location.indexOf('(')) +
                error_with_location.slice(error_with_location.indexOf(')') + 1, error_with_location.indexOf(')')) 
            );
            let syntax_error: boolean = isInstance(e, SyntaxError);
            console.error(`\x1b[31m[${now.toLocaleDateString()} ${now.toLocaleTimeString()}] [ERROR] ${syntax_error ? 'SyntaxError: ' : ''}${e.message}`);
            console.error(`\t\t\t\t${error_with_location}\x1b[0m`);
            return {'error': e.message}
        }
    }

    @Post('dml')
    async execute_dml(@Body() buffer: string) {
        try {
            const lexemes: Token[][] = token_array_split(
                this._service.lex(buffer).filter(token => token.type !== TokenType.COMMENT),
                { type: TokenType.SEMICOLON }
            );
            const ASTs: ASTNode[] = this._service.parse_dml(lexemes);
            const results: ExecutionResult[] = await this._service.execute_dml_async(ASTs);
            return results;
        }
        catch (e) {
            let now: Date = new Date();
            let error_with_location: string = e.stack.split('\n')[1].trim();
            error_with_location = (
                error_with_location.slice(0, error_with_location.indexOf('(')) +
                error_with_location.slice(error_with_location.indexOf(')') + 1, error_with_location.indexOf(')')) 
            );
            let syntax_error: boolean = isInstance(e, SyntaxError);
            console.error(`\x1b[31m[${now.toLocaleDateString()} ${now.toLocaleTimeString()}] [ERROR] ${syntax_error ? 'SyntaxError: ' : ''}${e.message}`);
            console.error(`\t\t\t\t${error_with_location}\x1b[0m`);
            return {'error': e.message}
        }
    }
}
