import { ReactElement, useCallback, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { createElementKey } from "../../../helpers";
import { AllBrownCells } from "../../../recoil/atoms";
import { isAvailableToGoCellSelector } from "../../../recoil/selectors";
import {
  useUpdateActiveCheckerPosition,
  useUpdatePositionSideOperations,
} from "./hooks";
import { BrownCellContainer } from "./styles";
import type { BrownCellI } from "./types";

export default function BrownCell({
  rowIndex,
  columnIndex,
  containCheckerInitially,
}: BrownCellI): ReactElement {
  const cellKey = createElementKey(rowIndex, columnIndex);

  const [cellData, setCellData] = useRecoilState(AllBrownCells(cellKey));
  const updateActiveChecker = useUpdateActiveCheckerPosition();
  const updatePositionSideOperations = useUpdatePositionSideOperations();

  const isAvailableCell = useRecoilValue(isAvailableToGoCellSelector(cellKey));

  useEffect(() => {
    if (cellData) {
      setCellData({
        ...cellData,
        associatedCellKey: containCheckerInitially ? cellKey : null,
      });
    }
  }, []);

  const handleBrownCellClick = useCallback(() => {
    if (cellData && isAvailableCell) {
      updateActiveChecker(cellData);
      updatePositionSideOperations(cellData);
    }
  }, [
    cellData,
    updateActiveChecker,
    isAvailableCell,
    updatePositionSideOperations,
  ]);

  return (
    <BrownCellContainer
      onClick={handleBrownCellClick}
      $isAvailableCell={isAvailableCell}
    />
  );
}
