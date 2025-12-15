import { ASTNode } from "../ast";

export interface TruncateTableStatement extends ASTNode {
    type: "TruncateTable",
    tables: string[]
}