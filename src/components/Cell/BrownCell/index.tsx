import { ReactElement, useCallback, useEffect } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { createElementKey } from "../../../helpers";
import { AllBrownCells, AllBrownCellsKeys } from "../../../recoil/atoms";
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
  const updateAllBrownCellsKeys = useSetRecoilState(AllBrownCellsKeys);

  const isAvailableCell = useRecoilValue(isAvailableToGoCellSelector(cellKey));

  useEffect(() => {
    updateAllBrownCellsKeys((state) => [...state, cellKey]);
    setCellData({
      ...cellData,
      associatedCheckerKey: containCheckerInitially ? cellKey : null,
    });
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
