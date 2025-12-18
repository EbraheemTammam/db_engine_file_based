import { Executer } from "src/backend/executer";
import { TABLE_DIR, TABLE_PAGE_DATA_FILE } from "src/interfaces/catalog";
import { TruncateTableStatement } from "src/interfaces/ddl/truncate_statement_ast";
import { ExecutionResult } from "src/interfaces/execution_result";

export class TruncateExecuter extends Executer {
    public override async execute_async(statement: TruncateTableStatement) : Promise<ExecutionResult> {
        for (const name of statement.tables) {
            if (!await this._analyzer.check_table_existance_async(name))
                throw new Error(`table ${name} does not exist`);
        }
        await this._file_handler.delete_dirs_async(statement.tables.map(name => TABLE_DIR(name)));
        for (const table of statement.tables)
            await this._file_handler.write_async(TABLE_PAGE_DATA_FILE(table, 1), [[]]);
        return { type: "COMMAND", tag: "TRUNCATE TABLE" }
    }
}