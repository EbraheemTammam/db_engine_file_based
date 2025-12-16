import { NotImplementedException } from "@nestjs/common";
import { Executer } from "src/backend/executer";
import { ASTNode } from "src/interfaces/ast";
import { ExecutionResult } from "src/interfaces/execution_result";

export class AlterExecuter extends Executer {
    private readonly _action: string;
    
    constructor(node: ASTNode, action: string) {
        super(node);
        this._action = action;
    }

    public execute() : ExecutionResult {
        throw new NotImplementedException();
    }
}