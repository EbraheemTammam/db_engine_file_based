import { ASTNode } from "../ast";
import { LogicalConditionStatement } from "./logical_condition_ast";

export interface DeleteStatement extends ASTNode {
    type: "Delete",
    table_name: string,
    condition?: LogicalConditionStatement
}