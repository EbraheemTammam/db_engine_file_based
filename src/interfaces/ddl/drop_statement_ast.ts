import { ASTNode } from "../ast";

export interface DropStatement extends ASTNode {
    type: "DropDatabase" | "DropTable" | "DropIndex",
    objects: string[]
}