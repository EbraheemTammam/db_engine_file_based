import { ASTNode } from "../ast";
import { LogicalConditionStatement } from "./logical_condition_ast";

export interface DeleteStatement extends ASTNode {
    type: "DeleteStatement",
    table_name: string,
    condition?: LogicalConditionStatement
}