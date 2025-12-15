import { ASTNode } from "../ast"

export interface AlterStatement extends ASTNode {
    type: "AlterTableAddColumn" |
          "AlterTableDropColumn" | 
          "AlterTableRenameColumn" |
          "AlterTableAlterColumnDataType" |
          "AlterTableAlterColumnDefaultValue" |
          "AlterTableAlterColumnNotNull" |
          "RenameDatabase" |
          "RenameTable" |
          "RenameIndex",
    name: string
}

export interface AlterTableColumnStatement extends AlterStatement {
    type: "AlterTableAddColumn" |  
          "AlterTableDropColumn" | 
          "AlterTableRenameColumn" |
          "AlterTableAlterColumnDataType" |
          "AlterTableAlterColumnDefaultValue" |
          "AlterTableAlterColumnNotNull",
    column_name: string,
    new_name?: string,
    data_type?: string,
    constraints?: {
        default?: string | number | boolean | null,
        pk?: boolean,
        unique?: boolean,
        not_null?: boolean,
        reference?: string
    }
}

export interface RenameStatement extends AlterStatement {
    type: "RenameDatabase" | "RenameTable" | "RenameIndex",
    new_name: string
}