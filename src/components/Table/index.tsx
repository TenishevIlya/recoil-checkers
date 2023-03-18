import React, { ReactElement, ReactNode, useCallback } from "react";
import type { TableI } from "./types";
import tableStyles from "./Table.module.css";
import { cellStyleMatcher } from "./helper";

export default function Table({ columns = 6, rows = 6 }: TableI): ReactElement {
  const cellGenerator = useCallback(
    (rowIndex: number) => {
      const cells: ReactNode[] = [];

      for (let index = 0; index < columns; index++) {
        cells.push(
          <td
            className={cellStyleMatcher(rowIndex, index)}
            key={`cell_${index}`}
          />
        );
      }

      return cells;
    },
    [columns]
  );

  const rowsGenerator = useCallback(() => {
    const rowsElements: ReactNode[] = [];

    for (let index = 0; index < rows; index++) {
      rowsElements.push(<tr key={`row_${index}`}>{cellGenerator(index)}</tr>);
    }

    return rowsElements;
  }, [rows, cellGenerator]);

  return (
    <table className={tableStyles.tableStyles}>
      <tbody>{rowsGenerator()}</tbody>
    </table>
  );
}
