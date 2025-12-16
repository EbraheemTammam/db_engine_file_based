import { NotImplementedException } from "@nestjs/common";
import { Executer } from "src/backend/executer";
import { CreateTableStatement } from "src/interfaces/ddl/create_statement_ast";
import { ExecutionResult } from "src/interfaces/execution_result";

export class CreateExecuter extends Executer {
    public override execute(statement: CreateTableStatement): ExecutionResult {
        throw new NotImplementedException();
    }
}