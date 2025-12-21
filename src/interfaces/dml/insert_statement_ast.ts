import { ASTNode } from "../ast";
import { premitive } from "../catalog";

export interface InsertStatement extends ASTNode {
    type: "Insert",
    table: string,
    columns?: string[],
    values: Array<Array<premitive>>
}