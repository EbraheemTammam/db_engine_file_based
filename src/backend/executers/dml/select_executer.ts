import { Executer } from "src/backend/executer";
import { TABLE_PAGE_DATA_FILE } from "src/constants/file_path";
import { AttributeCatalog, data_type, premitive, RelationCatalog } from "src/interfaces/catalog";
import { SelectStatement } from "src/interfaces/dml/select_statement_ast";
import { ExecutionResult } from "src/interfaces/execution_result";

export class SelectExecuter extends Executer {
    public async execute_async(statement: SelectStatement): Promise<ExecutionResult> {
        const relation_catalog: RelationCatalog = await this._analyzer.get_relation_catalog_async(statement.table);
        const all_attrs: AttributeCatalog[] = await this._analyzer.get_table_attributes_catalogs_async(relation_catalog.name);
        let attributes_catalogs: AttributeCatalog[] = [];
        for (let i: number = 0; i < statement.columns.length; ++i) {
            if (statement.columns[i] === '*') {
                attributes_catalogs.push(...all_attrs);
                continue;
            }
            attributes_catalogs.push(all_attrs.filter(c => c.name === statement.columns[i])[0]);
        }
        const select_indexes: number[] = attributes_catalogs.map(ac => ac.index);
        let order_indexes: number[] = [];
        if (statement.ordering !== undefined) {
            const attrs_names: string[] = all_attrs.map(attr => attr.name);
            order_indexes = statement.ordering?.map(col => {
                if (!attrs_names.includes(col))
                    throw new Error(`attribute ${col} does not exist in elation ${relation_catalog.name}`);
                return all_attrs.filter(attr => attr.name === col)[0].index
            });
        }
        const schema: data_type[] = all_attrs.map(attr => attr.type);
        switch (statement.condition) {
            case undefined:
                return this.select_all(statement, relation_catalog, schema, select_indexes, order_indexes);
            default:
                return this.select_one(statement, schema, select_indexes);
        }
    }

    private async select_one(statement: SelectStatement, schema: data_type[], indexes: number[]): Promise<ExecutionResult> {
        const id: number = statement.condition?.right as number;
        const page_number: number = this._analyzer.get_page_number(id);
        for await (const line of this._file_handler.stream_read_async(
            TABLE_PAGE_DATA_FILE(statement.table, page_number), 
            schema
        )) {
            if (Number(line[0]) === id) {
                const res: premitive[] = [];
                for (const index of indexes)
                    res.push(line[index]);
                return { type: "ROWS", tag: "SELECT", row_count: 1, rows: [res] };
            }
        }
        return { type: "ROWS", tag: "SELECT", row_count: 0, rows: [] };
    }

    private async select_all(
        statement: SelectStatement, 
        relation_catalog: RelationCatalog,
        schema: data_type[], 
        select_indexes: number[],
        ordering_indexes: number[]
    ): Promise<ExecutionResult> {
        let buffer: premitive[][] = [];
        for (let page_number: number = 1; page_number <= relation_catalog.page_count; ++page_number) {
            let hit_limit: boolean = false;
            for await (const line of this._file_handler.stream_read_async(
                TABLE_PAGE_DATA_FILE(relation_catalog.name, page_number),
                schema
            )) {
                const res: premitive[] = [];
                for (const index of select_indexes)
                    res.push(line[index]);
                for (const index of ordering_indexes)
                    res.push(line[index]);
                buffer.push(res);
                if (statement.limit !== undefined && buffer.length === statement.limit) {
                    hit_limit = true;
                    break;
                }
            }
            if (hit_limit) break;
        }
        if (ordering_indexes.length > 0)
            buffer = buffer.sort((e1, e2) => this.order(e1, e2, ordering_indexes));
        return { 
            type: "ROWS", 
            tag: "SELECT", 
            row_count: buffer.length, 
            rows: buffer.map(el => el.slice(0, select_indexes.length)) 
        };
    }

    private order(row1: premitive[], row2: premitive[], indexes: number[], iterator: number = 0): number {
        if (iterator >= indexes.length) return 0;
        const index = indexes[iterator];
        if (row1[index]! < row2[index]!) return -1;
        else if (row1[index]! > row2[index]!) return 1;
        else return this.order(row1, row2, indexes, iterator + 1)
    }
}