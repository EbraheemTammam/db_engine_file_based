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
        let dbs: Token[] = new Array<Token>();
        dbs.push(this.consume(TokenType.IDENTIFIER));
        if (typeof(dbs[0].value) !== "string") 
            throw new Error(`syntax error: expected identifier, got '${dbs[0].value}'`);
        while (![TokenType.EOF, TokenType.SEMICOLON].includes(this.peek().type)) {
            this.consume(TokenType.COMMA);
            dbs.push(this.consume(TokenType.IDENTIFIER));
        }
        return {
            type: "DropDatabaseStatement",
            objects: dbs.map(t => {
                if (typeof(t.value) !== "string") 
                    throw new Error(`syntax error: expected identifier, got '${t.value}'`);
                return t.value;
            })
        }
    }

    private parse_drop_table() : DropTableStatement {
        this.consume(TokenType.KEYWORD, 'TABLE');
        let tables: Token[] = new Array<Token>();
        tables.push(this.consume(TokenType.IDENTIFIER));
        if (typeof(tables[0].value) !== "string") 
            throw new Error(`syntax error: expected identifier, got '${tables[0].value}'`);
        while (![TokenType.EOF, TokenType.SEMICOLON].includes(this.peek().type)) {
            this.consume(TokenType.COMMA);
            tables.push(this.consume(TokenType.IDENTIFIER));
        }
        return {
            type: "DropTableStatement",
            objects: tables.map(t => {
                if (typeof(t.value) !== "string") 
                    throw new Error(`syntax error: expected identifier, got '${t.value}'`);
                return t.value;
            })
        }
    }

    private parse_drop_index() : DropIndexStatement {
        this.consume(TokenType.KEYWORD, 'INDEX');
        let indexes: Token[] = new Array<Token>();
        indexes.push(this.consume(TokenType.IDENTIFIER));
        if (typeof(indexes[0].value) !== "string") 
            throw new Error(`syntax error: expected identifier, got '${indexes[0].value}'`);
        while (![TokenType.EOF, TokenType.SEMICOLON].includes(this.peek().type)) {
            this.consume(TokenType.COMMA);
            indexes.push(this.consume(TokenType.IDENTIFIER));
        }
        return {
            type: "DropIndexStatement",
            objects: indexes.map(t => {
                if (typeof(t.value) !== "string") 
                    throw new Error(`syntax error: expected identifier, got '${t.value}'`);
                return t.value;
            })
        }
    }
}