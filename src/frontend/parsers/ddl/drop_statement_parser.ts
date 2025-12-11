import { Parser } from "src/frontend/parser";
import { Token, TokenType } from "src/interfaces/token";
import { 
    DropDatabaseStatement, 
    DropIndexStatement, 
    DropStatement, 
    DropTableStatement 
} from "src/interfaces/ddl/drop_statement_ast";

export class DropStatementParser extends Parser {
    public parse() : DropStatement {
        this.consume(TokenType.KEYWORD, 'DROP');
        let next: Token = this.peek();
        switch (next.value) {
            case "DATABASE":
                return this.parse_drop_database();
            case "TABLE":
                return this.parse_drop_table();
            case "INDEX":
                return this.parse_drop_index();
            default:
                throw new Error(`syntax error: expected identifier, got '${next.value}'`);
        }
    }

    private parse_drop_database() : DropDatabaseStatement {
        this.consume(TokenType.KEYWORD, 'DATABASE');
        let name: Token = this.consume(TokenType.IDENTIFIER);
        if (typeof(name.value) !== "string") 
            throw new Error(`syntax error: expected identifier, got '${name.value}'`);
        return {
            type: "DropDatabaseStatement",
            name: name.value
        }
    }

    private parse_drop_table() : DropTableStatement {
        this.consume(TokenType.KEYWORD, 'TABLE');
        let name: Token = this.consume(TokenType.IDENTIFIER);
        if (typeof(name.value) !== "string") 
            throw new Error(`syntax error: expected identifier, got '${name.value}'`);
        return {
            type: "DropTableStatement",
            name: name.value
        }
    }

    private parse_drop_index() : DropIndexStatement {
        this.consume(TokenType.KEYWORD, 'INDEX');
        let name: Token = this.consume(TokenType.IDENTIFIER);
        if (typeof(name.value) !== "string") 
            throw new Error(`syntax error: expected identifier, got '${name.value}'`);
        return {
            type: "DropIndexStatement",
            name: name.value
        }
    }
}