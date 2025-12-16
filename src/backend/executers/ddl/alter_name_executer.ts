import { NotImplementedException } from "@nestjs/common";
import { Executer } from "src/backend/executer";
import { ExecutionResult } from "src/interfaces/execution_result";

export class AlterNameExecuter extends Executer {
    public execute() : ExecutionResult {
        throw new NotImplementedException();
    }
}