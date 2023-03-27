import { ReactElement, useCallback, useEffect, useMemo, useState } from "react";
import { useSetRecoilState } from "recoil";
import { createElementKey } from "../../../helpers";
import { AllBrownCells } from "../../../recoil/atoms";
import { useUpdateActiveCheckerPosition } from "./hooks";
import { BrownCellContainer } from "./styles";
import { BrownCellI, CellDimensions } from "./types";

export default function BrownCell({
  rowIndex,
  columnIndex,
}: BrownCellI): ReactElement {
  const [cellDimensions, setCellDimension] = useState<CellDimensions | null>(
    null
  );
  const setAtomCellData = useSetRecoilState(
    AllBrownCells(createElementKey(rowIndex, columnIndex))
  );
  const updateActiveChecker = useUpdateActiveCheckerPosition();

  const handleCellRef = useCallback((cell: HTMLTableCellElement) => {
    if (cell !== null) {
      const { height, width } = cell.getBoundingClientRect();

      setCellDimension({ height, width });
    }
  }, []);

  const cellData = useMemo(() => {
    if (cellDimensions) {
      const { height, width } = cellDimensions;

      return {
        cellData: {
          columnIndex,
          rowIndex,
        },
        position: {
          xPos: width * columnIndex,
          yPos: height * rowIndex,
        },
      };
    }
  }, [columnIndex, rowIndex, cellDimensions]);

  useEffect(() => {
    if (cellData) {
      setAtomCellData(cellData);
    }
  }, [cellData, setAtomCellData]);

  const handleBrownCellClick = useCallback(() => {
    if (cellData) {
      updateActiveChecker(cellData);
    }
  }, [cellData, updateActiveChecker]);

  return (
    <BrownCellContainer ref={handleCellRef} onClick={handleBrownCellClick} />
  );
}
