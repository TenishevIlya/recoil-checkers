import React, {
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { TableDimensions, TableI } from "./types";
import { cellColorDetector } from "./helper";
import { FullTableContent, StyledTable } from "./styles";
import Cell from "../Cell";
import Checker from "../Checker";
import { CheckerMode } from "../Checker/types";

const CHECKERS_AMOUNT = 3;

export default function Table({ columns = 4, rows = 4 }: TableI): ReactElement {
  const tableRef = useRef<HTMLTableElement>(null);
  const [tableDimensions, setTableDimensions] =
    useState<TableDimensions | null>(null);

  useEffect(() => {
    const width = tableRef.current?.getBoundingClientRect().width;
    const height = tableRef.current?.getBoundingClientRect().height;

    if (width && height) {
      setTableDimensions({ height, width });
    }
  }, []);

  const cellGenerator = useCallback(
    (rowIndex: number) => {
      const cells: ReactNode[] = [];

      for (let index = 0; index < columns; index++) {
        cells.push(
          <Cell
            cellColor={cellColorDetector(rowIndex, index)}
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
      if (tableDimensions) {
        const { width, height } = tableDimensions;

        const cellHeight = height / columns;
        const cellWidth = width / rows;

        const cellXPos = cellWidth * columnIndex + 1;
        const cellYPos = cellHeight * rowIndex + 1;

        return <Checker top={cellYPos} left={cellXPos} mode={mode} />;
      }

      return null;
    },
    [columns, rows, tableDimensions]
  );

  const { blackCheckersCells, whiteCheckersCells } = brownCellsForCheckers;

  return (
    <FullTableContent>
      <StyledTable ref={tableRef}>
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
