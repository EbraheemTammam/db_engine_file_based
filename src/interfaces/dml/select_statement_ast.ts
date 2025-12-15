import { ASTNode } from "../ast"
import { LogicalConditionStatement } from "./logical_condition_ast"

export interface SelectStatement extends ASTNode {
    type: "Select",
    table: string,
    columns: string[],
    distinct: boolean,
    condition?: LogicalConditionStatement,
    grouping?: string[],
    ordering?: string[],
    limit?: number
}