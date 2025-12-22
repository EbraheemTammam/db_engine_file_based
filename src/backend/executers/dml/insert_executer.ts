import { Analyzer } from "src/backend/analyzer";
import { Executer } from "src/backend/executer";
import { TABLE_PAGE_DATA_FILE } from "src/constants/file_path";
import { AttributeCatalog, premitive, RelationCatalog } from "src/interfaces/catalog";
import { InsertStatement } from "src/interfaces/dml/insert_statement_ast";
import { ExecutionResult } from "src/interfaces/execution_result";

export class InsertExecuter extends Executer {
    public async execute_async(statement: InsertStatement): Promise<ExecutionResult> {
        // if there're targeted columns check for duplicates
        if (statement.columns && (new Set<string>(statement.columns)).size < statement.columns.length) {
            throw new Error('multiple assignments to the same column');
        }
        // check for number of provided expressions to match the number of targeted columns
        this._analyzer.validate_values_length_async(statement.table, statement.columns, statement.values);
        // validate provided expressions matching columns datatypes
        await this._analyzer.validate_column_datatypes_async(statement.table, statement.columns, statement.values);
        // validate excluded columns have a default value or accept nulls
        const excluded_attrs: AttributeCatalog[] = await this._analyzer.get_excluded_attributes_async(
            statement.table, statement.columns
        );
        for (const attr of excluded_attrs) {
            if (!attr.not_null) continue;
            if (attr.default !== null) continue;
            if (attr.type === "SERIAL") continue;
            throw new Error(`column ${attr.name} can not be null`);
        }
        // validating nullability of columns
        const attrs_catalogs: AttributeCatalog[] = (
            statement.columns === undefined ?
            await this._analyzer.get_table_attributes_catalogs_async(statement.table) :
            await this._analyzer.get_attributes_catalogs_async(statement.table, statement.columns)
        );
        const values: premitive[][] = this._analyzer.validate_not_null(attrs_catalogs, statement.values);
        const indexes: number[] = await this._analyzer.get_column_indexes_async(statement.table, statement.columns);
        // insertion buffer construction
        const buffer: premitive[][] = [];
        const relation_catalog: RelationCatalog = await this._analyzer.get_relation_catalog_async(statement.table);
        for (const row of values) {
            const sub_buffer: premitive[] = new Array();
            for (let i: number = 0; i < relation_catalog.column_count; ++i) {
                if (indexes.includes(i)) {
                    sub_buffer[i] = row[indexes.indexOf(i)];
                    continue;
                }
                const catalog: AttributeCatalog = excluded_attrs.filter(attr => attr.index === i)[0];
                if (catalog.type === "SERIAL") {
                    sub_buffer.push(++relation_catalog.last_index);
                    continue;
                }
                if (catalog.default !== undefined) {
                    sub_buffer.push(catalog.default);
                    continue;
                }
                sub_buffer.push(null);
            }
            buffer.push(sub_buffer);
        }
        // validate unique constraints
        const unique_columns_indexes: number[] = [
            ...attrs_catalogs.filter(attr => attr.unique || attr.pk),
            ...excluded_attrs.filter(attr => attr.unique || attr.pk)
        ].map(attr => attr.index).sort();
        await this._analyzer.validate_unique_constraints(statement.table, unique_columns_indexes, statement.values);
        // writing the insert buffer
        let page_number: number = Math.ceil(((relation_catalog.last_index - statement.values.length) + 1) / Analyzer.PAGE_SIZE);
        let remaining_untill_full_page: number = Analyzer.PAGE_SIZE - (
            (relation_catalog.last_index - statement.values.length) % Analyzer.PAGE_SIZE
        );
        if (buffer.length <= remaining_untill_full_page)
            await this._file_handler.append_async(TABLE_PAGE_DATA_FILE(relation_catalog.name, page_number), buffer);
        else {
            let i: number = 0;
            while (i < buffer.length) {
                await this._file_handler.append_async(
                    TABLE_PAGE_DATA_FILE(relation_catalog.name, page_number), 
                    buffer.slice(i, i + remaining_untill_full_page)
                );
                i += remaining_untill_full_page;
                remaining_untill_full_page = buffer.length - i > Analyzer.PAGE_SIZE ? Analyzer.PAGE_SIZE : buffer.length - i;
                ++page_number;
                ++relation_catalog.page_count;
            }
            --relation_catalog.page_count;
        }
        relation_catalog.row_count += buffer.length;
        // updating the relation schema (last index and row count)
        await this._analyzer.update_relation_schema_async(relation_catalog);
        return { type: "COMMAND", tag: "INSERT", row_count: buffer.length }
    }
}