import { ReactElement, ReactNode, useCallback } from "react";
import { cellColorDetector } from "./helper";
import { FullTableContent, StyledTable } from "./styles";
import Cell from "../Cell";
import Checker from "../Checker";
import { CheckerMode } from "../Checker/types";
import { createElementKey } from "../../helpers";
import { useRecoilValue } from "recoil";
import { BrownCellsForCheckers, TableDimensions } from "../../recoil/atoms";

export default function Table(): ReactElement {
  const { rows, columns } = useRecoilValue(TableDimensions);
  const { whiteCheckersCells, blackCheckersCells } = useRecoilValue(
    BrownCellsForCheckers(createElementKey(rows, columns))
  );

  const cellGenerator = useCallback(
    (rowIndex: number) => {
      const cells: ReactNode[] = [];
      const allCheckersCells = [...whiteCheckersCells, ...blackCheckersCells];

      for (let index = 0; index < columns; index++) {
        const containChecker = allCheckersCells.some(
          (value) => value.rowIndex === rowIndex && value.columnIndex === index
        );

        cells.push(
          <Cell
            cellColor={cellColorDetector(rowIndex, index)}
            key={`cell_${index}`}
            columnIndex={index}
            rowIndex={rowIndex}
            containCheckerInitially={containChecker}
          />
        );
      }

      return cells;
    },
    [columns, whiteCheckersCells, blackCheckersCells]
  );

  const rowsGenerator = useCallback(() => {
    const rowsElements: ReactNode[] = [];

    for (let index = 0; index < rows; index++) {
      rowsElements.push(<tr key={`row_${index}`}>{cellGenerator(index)}</tr>);
    }

    return rowsElements;
  }, [rows, cellGenerator]);

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
