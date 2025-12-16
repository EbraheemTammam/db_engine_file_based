export interface ExecutionResult {
    type: "ROWS" | "COMMAND",
    headers?: string[]
    rows?: []
    row_count?: number,
    tag: string
}