export interface CsvParseResult {
    headers: string[];

    rows: string[][];
}

const parseLine = (
    line: string,
): string[] => {
    const cells: string[] = [];

    let current = "";

    let inQuotes = false;

    for (
        let index = 0;
        index < line.length;
        index += 1
    ) {
        const char = line[index];

        if (inQuotes) {
            if (char === '"') {
                if (line[index + 1] === '"') {
                    current += '"';

                    index += 1;
                } else {
                    inQuotes = false;
                }
            } else {
                current += char;
            }

            continue;
        }

        if (char === '"') {
            inQuotes = true;

            continue;
        }

        if (char === ",") {
            cells.push(current);

            current = "";

            continue;
        }

        current += char;
    }

    cells.push(current);

    return cells;
};

export const parseCsv = (
    content: string,
): CsvParseResult => {
    const normalized = content
        .replace(/^\uFEFF/, "")
        .replace(/\r\n/g, "\n");

    const lines = normalized.split("\n");

    const validLines = lines.filter(
        (line) => line.trim().length > 0,
    );

    if (validLines.length < 2) {
        return {
            headers: [],
            rows: [],
        };
    }

    const headers = parseLine(validLines[0]);

    const rows = validLines
        .slice(1)
        .map((line) => parseLine(line));

    return {
        headers,
        rows,
    };
};

export const buildCsv = (
    headers: string[],
    rows: string[][],
): string => {
    const escapeCell = (value: string): string => {
        return value.includes(",")
            ? `"${value.replace(/"/g, '""')}"`
            : value;
    };

    const headerLine =
        headers.map(escapeCell).join(",");

    const bodyLines =
        rows.map((row) => row.map(escapeCell).join(","));

    return [headerLine, ...bodyLines].join("\n");
};