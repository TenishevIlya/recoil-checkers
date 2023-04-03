import { ReactElement, useCallback, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { createElementKey } from "../../../helpers";
import { AllBrownCells } from "../../../recoil/atoms";
import { isAvailableToGoCellSelector } from "../../../recoil/selectors";
import { useUpdateActiveCheckerPosition } from "./hooks";
import { BrownCellContainer } from "./styles";
import type { BrownCellI } from "./types";

export default function BrownCell({
  rowIndex,
  columnIndex,
  containCheckerInitially,
}: BrownCellI): ReactElement {
  const [cellData, setCellData] = useRecoilState(
    AllBrownCells(createElementKey(rowIndex, columnIndex))
  );
  const updateActiveChecker = useUpdateActiveCheckerPosition();

  const isAvailableCell = useRecoilValue(
    isAvailableToGoCellSelector(createElementKey(rowIndex, columnIndex))
  );

  useEffect(() => {
    if (cellData) {
      setCellData({ ...cellData, containChecker: containCheckerInitially });
    }
  }, []);

  const handleBrownCellClick = useCallback(() => {
    if (cellData && isAvailableCell) {
      updateActiveChecker(cellData);
    }
  }, [cellData, updateActiveChecker, isAvailableCell]);

  return (
    <BrownCellContainer
      onClick={handleBrownCellClick}
      $isAvailableCell={isAvailableCell}
    />
  );
}
