import { ASTNode } from "../ast";

export type value = string | number | boolean | null;

export interface InsertStatement extends ASTNode {
    type: "Insert",
    table: string,
    columns?: string[],
    values: Array<Array<value>>
}