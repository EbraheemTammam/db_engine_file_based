import { Parser } from "src/frontend/parser";
import { Token, TokenType } from "src/interfaces/token";
import { 
    CreateDatabaseStatement, 
    CreateIndexStatement, 
    CreateStatement, 
    CreateTableColumnStatement, 
    CreateTableStatement 
} from "src/interfaces/ddl/create_statement_ast";

export class CreateStatementParser extends Parser {
    public override parse() : CreateStatement {
        this.consume(TokenType.KEYWORD, 'CREATE');
        let next: Token = this.peek();
        let statement: CreateStatement;
        switch (next.value) {
            // case "DATABASE":
            //     statement = this.parse_create_database();
            //     break;
            case "TABLE":
                statement = this.parse_create_table();
                break;
            // case "INDEX":
            //     statement = this.parse_create_index();
            //     break;
            default:
                throw new SyntaxError(`expected identifier, got ${next.value}`);
        }
        if (this._cursor < this._length && this._lexemes[this._cursor].type !== TokenType.EOF)
            throw new SyntaxError(`unexpected token ${this.peek().value}, expected ; or EOF`);
        return statement;
    }

    private parse_create_database() : CreateDatabaseStatement {
        this.consume(TokenType.KEYWORD, 'DATABASE');
        let db_name: Token = this.consume(TokenType.IDENTIFIER);
        this.validate_token_datatype(db_name);
        let skip_if_exists: boolean = false;
        if (this.peek().value === 'IF') {
            this.consume(TokenType.KEYWORD, 'IF');
            this.consume(TokenType.KEYWORD, 'NOT');
            this.consume(TokenType.KEYWORD, 'EXISTS');
            skip_if_exists = true;
        }
        let statement: CreateDatabaseStatement = {
            type: "CreateDatabase",
            name: db_name.value as string,
            skip_if_exists: skip_if_exists
        }
        if (this.peek().value === 'WITH') {
            this.consume(TokenType.KEYWORD, 'WITH');
            this.consume(TokenType.KEYWORD, 'OWNER');
            let owner: Token = this.consume(TokenType.IDENTIFIER);
            this.validate_token_datatype(owner);
            statement.options = {
                'owner': owner.value as string
            }
        }
        return statement;
    }

    private parse_create_table() : CreateTableStatement {
        this.consume(TokenType.KEYWORD, 'TABLE');
        let skip_if_exists: boolean = false;
        if (this.peek().value === 'IF') {
            this.consume(TokenType.KEYWORD, 'IF');
            this.consume(TokenType.KEYWORD, 'NOT');
            this.consume(TokenType.KEYWORD, 'EXISTS');
            skip_if_exists = true;
        }
        let table_name: Token = this.consume(TokenType.IDENTIFIER);
        this.validate_token_datatype(table_name);
        let columns: CreateTableColumnStatement[] = new Array<CreateTableColumnStatement>();
        let iterator: Token = this.consume(TokenType.OPEN_PARAN, '(');
        while (iterator.type !== TokenType.CLOSE_PARAN) {
            iterator = this.consume(TokenType.IDENTIFIER);
            this.validate_token_datatype(iterator);
            let ctype: Token = this.consume(TokenType.TYPE);
            this.validate_token_datatype(ctype);
            let [pk, not_null, unique]: [boolean, boolean, boolean] = [false, false, false];
            let default_value: string | number | boolean | undefined;
            let reference: string | undefined;
            let column: CreateTableColumnStatement = {
                name: iterator.value as string,
                data_type: ctype.value as string,
            }
            let next: Token;
            while (true) {
                next = this.peek();
                if ([TokenType.COMMA, TokenType.CLOSE_PARAN].includes(next.type)) break;
                switch (next.value) {
                    case 'PRIMARY':
                        this.consume(TokenType.KEYWORD, 'PRIMARY');
                        this.consume(TokenType.KEYWORD, 'KEY');
                        pk = true;
                        break;
                    case 'NOT':
                        this.consume(TokenType.KEYWORD, 'NOT');
                        this.consume(TokenType.NULL);
                        not_null = true;
                        break;
                    case 'UNIQUE':
                        this.consume(TokenType.KEYWORD, 'UNIQUE');
                        unique = true;
                        break;
                    case 'DEFAULT':
                        this.consume(TokenType.KEYWORD, 'DEFAULT');
                        default_value = this.consume().value;
                        break;
                    case 'REFERENCES':
                        this.consume(TokenType.KEYWORD, 'REFERENCES');
                        reference = [
                            this.consume(TokenType.IDENTIFIER).value, 
                            this.consume(TokenType.OPEN_PARAN, '(').value,
                            this.consume(TokenType.IDENTIFIER).value,
                            this.consume(TokenType.CLOSE_PARAN).value
                        ].join('');
                    default:
                        throw new SyntaxError(`unexpected token '${next.value}'`);
                }
            }
            iterator = this.consume();
            if (iterator.type === TokenType.COMMA && this.peek().type === TokenType.CLOSE_PARAN) 
                throw new SyntaxError(`unexpected token '${iterator.value}', expected )`)
            column.constraints = {
                default: default_value,
                pk: pk,
                unique: (unique || pk), 
                not_null: not_null || pk,
                reference: reference
            }
            columns.push(column);
        }
        return {
            type: "CreateTable",
            name: table_name.value as string,
            skip_if_exists: skip_if_exists,
            columns: columns
        }
    }

    private parse_create_index() : CreateIndexStatement {
        this.consume(TokenType.KEYWORD, 'INDEX');
        let skip_if_exists: boolean = false;
        if (this.peek().value == 'IF') {
            this.consume(TokenType.KEYWORD, 'IF');
            this.consume(TokenType.KEYWORD, 'NOT');
            this.consume(TokenType.KEYWORD, 'EXISTS');
            skip_if_exists = true;
        }
        let index_name: Token = this.consume(TokenType.IDENTIFIER);
        this.validate_token_datatype(index_name);
        this.consume(TokenType.KEYWORD, 'ON');
        let table_name: Token = this.consume(TokenType.IDENTIFIER);
        this.validate_token_datatype(table_name);
        this.consume(TokenType.OPEN_PARAN, '(');
        let cols: string[] = new Array<string>();
        while (true) {
            let col: Token = this.consume(TokenType.IDENTIFIER);
            this.validate_token_datatype(col);
            cols.push(col.value as string);
            let next: Token = this.peek();
            if (next.type === TokenType.COMMA) {
                this.consume(TokenType.COMMA);
                continue;
            }
            else if (next.type === TokenType.CLOSE_PARAN) {
                this.consume(TokenType.CLOSE_PARAN);
                break;
            }
            else throw new SyntaxError(`unexpected token ${next.value}, expected ')'`);
        }
        return {
            type: "CreateIndex",
            name: index_name.value as string,
            table_name: table_name.value as string,
            columns: cols,
            skip_if_exists: skip_if_exists
        }
    }
}