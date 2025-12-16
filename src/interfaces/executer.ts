import { ExecutionResult } from "./execution_result";

export interface IExecuter {
    execute() : ExecutionResult;
}