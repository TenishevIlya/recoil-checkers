import { ReactElement, ReactNode, useCallback, useMemo } from "react";
import type { TableI } from "./types";
import { cellColorDetector } from "./helper";
import { FullTableContent, StyledTable } from "./styles";
import Cell from "../Cell";
import Checker from "../Checker";
import { CheckerMode } from "../Checker/types";
import { createElementKey } from "../../helpers";

const CHECKERS_AMOUNT = 3;

export default function Table({ columns = 4, rows = 4 }: TableI): ReactElement {
  const cellGenerator = useCallback(
    (rowIndex: number) => {
      const cells: ReactNode[] = [];

      for (let index = 0; index < columns; index++) {
        cells.push(
          <Cell
            cellColor={cellColorDetector(rowIndex, index)}
            key={`cell_${index}`}
            columnIndex={index}
            rowIndex={rowIndex}
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

  const brownCellsForCheckers = useMemo(() => {
    const cellsToRender: Array<{ rowIndex: number; columnIndex: number }> = [];

    for (let index = 0; index < rows; index++) {
      for (let innerIndex = 0; innerIndex < columns; innerIndex++) {
        if (
          (index % 2 === 0 && innerIndex % 2 !== 0) ||
          (index % 2 !== 0 && innerIndex % 2 === 0)
        ) {
          cellsToRender.push({ rowIndex: index, columnIndex: innerIndex });
        }
      }
    }

    return {
      whiteCheckersCells: cellsToRender.slice(0, CHECKERS_AMOUNT),
      blackCheckersCells: cellsToRender.slice(
        cellsToRender.length - CHECKERS_AMOUNT,
        cellsToRender.length
      ),
    };
  }, [rows, columns]);

  const renderChecker = useCallback(
    (rowIndex: number, columnIndex: number, mode: CheckerMode) => {
      return (
        <Checker
          key={createElementKey(rowIndex, columnIndex)}
          mode={mode}
          {...{ columnIndex, rowIndex }}
        />
      );
    },
    []
  );

  const { blackCheckersCells, whiteCheckersCells } = brownCellsForCheckers;

  return (
    <FullTableContent>
      <StyledTable>
        <tbody>{rowsGenerator()}</tbody>
      </StyledTable>
      {whiteCheckersCells.map(({ columnIndex, rowIndex }) =>
        renderChecker(rowIndex, columnIndex, CheckerMode.white)
      )}
      {blackCheckersCells.map(({ columnIndex, rowIndex }) =>
        renderChecker(rowIndex, columnIndex, CheckerMode.black)
      )}
    </FullTableContent>
  );
}
