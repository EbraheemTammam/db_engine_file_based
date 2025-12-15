import { ASTNode } from "../ast"

export interface CreateStatement extends ASTNode {
    type: "CreateDatabase" | "CreateTable" | "CreateIndex",
    name: string,
    skip_if_exists: boolean
}

export interface CreateDatabaseStatement extends CreateStatement {
    type: "CreateDatabase",
    options?: {
        owner: string
    }
}

export interface CreateTableColumnStatement {
    name: string,
    data_type: string,
    constraints?: {
        default?: string | number | boolean,
        pk: boolean,
        unique: boolean,
        not_null: boolean,
        reference?: string
    }   
}

export interface CreateTableStatement extends CreateStatement {
    type: "CreateTable",
    columns: CreateTableColumnStatement[]
}

export interface CreateIndexStatement extends CreateStatement {
    type: "CreateIndex",
    table_name: string,
    columns: string[]
}
