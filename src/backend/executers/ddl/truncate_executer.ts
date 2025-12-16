import { Executer } from "src/backend/executer";
import { TruncateTableStatement } from "src/interfaces/ddl/truncate_statement_ast";
import { ExecutionResult } from "src/interfaces/execution_result";

export class TruncateExecuter extends Executer {
    public override async execute_async(statement: TruncateTableStatement) : Promise<ExecutionResult> {
        for (const name of statement.tables) {
            if (!await this._analyzer.check_table_existance(name)) {
                throw new Error(`table ${name} does not exist`);
            }
        }
        await this._file_handler.delete_dirs_async(statement.tables.map(o => `database/data/${o}`));
        let columns: Map<string, string[]> = new Map<string, string[]>();
        for await (const attr of this._file_handler.stream_read_async(
            'database/schema/attributes.csv', 
            ['TEXT', 'TEXT', 'TEXT', 'BOOL', 'BOOL', 'TEXT', 'BOOL', 'BOOL', 'TEXT']
        )) {
            if (statement.tables.includes(attr[0])) {
                if (typeof(columns[attr[0]]) === "undefined")
                    columns[attr[0]] = new Array();
                columns[attr[0]].push(attr[1]);
            }
        }
        for (const [key, value] of Object.entries(columns))
            await this._file_handler.write_async(`database/data/${key}/page_1.csv`, [[value.join(',')]]);
        return { type: "COMMAND", tag: "TRUNCATE TABLE" }
    }
}