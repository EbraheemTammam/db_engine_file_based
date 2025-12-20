import { Parser } from "src/frontend/parser";
import { Token, TokenType } from "src/interfaces/token";
import { 
    AlterStatement,
    RenameStatement,
} from "src/interfaces/ddl/alter_statement_ast";
import { AlterTableParser } from "./alter_table_parser";

export class AlterStatementParser extends Parser {
    public override parse() : AlterStatement {
        this.consume(TokenType.KEYWORD, 'ALTER');
        let next: Token = this.peek();
        let statement: AlterStatement;
        switch (next.value) {
            // case "DATABASE":
            //     statement = this.parse_rename_database();
            //     break;
            case "TABLE":
                return (new AlterTableParser(this._lexemes)).parse();
            // case "INDEX":
            //     statement = this.parse_rename_index();
            //     break;
            default:
                throw new SyntaxError(`expected identifier, got '${next.value}'`);
        }
        if (this._cursor < this._length && this._lexemes[this._cursor].type !== TokenType.EOF)
            throw new SyntaxError(`unexpected token ${this.peek().value}, expected ; or EOF`);
        return statement;
    }
    
    private parse_rename_database() : RenameStatement {
        this.consume(TokenType.KEYWORD, 'DATABASE');
        let db_name = this.consume(TokenType.IDENTIFIER);
        this.validate_token_datatype(db_name);
        this.consume(TokenType.KEYWORD, 'RENAME');
        this.consume(TokenType.KEYWORD, 'TO');
        let new_name = this.consume(TokenType.IDENTIFIER);
        this.validate_token_datatype(new_name);
        return {
            type: "AlterDatabaseName",
            name: db_name.value as string,
            new_name: new_name.value as string
        }
    }
    
    private parse_rename_index() : RenameStatement {
        this.consume(TokenType.KEYWORD, 'INDEX');
        let idx_name = this.consume(TokenType.IDENTIFIER);
        this.validate_token_datatype(idx_name);
        this.consume(TokenType.KEYWORD, 'RENAME');
        this.consume(TokenType.KEYWORD, 'TO');
        let new_name = this.consume(TokenType.IDENTIFIER);
        this.validate_token_datatype(new_name);
        return {
            type: "AlterIndexName",
            name: idx_name.value as string,
            new_name: new_name.value as string
        }
    }
}