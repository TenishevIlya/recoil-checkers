import { ReactElement, useCallback, useEffect } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { createElementKey } from "../../helpers";
import {
  ActiveChecker,
  AllCheckers,
  AllCheckersKeys,
  CurrentSideTurn,
} from "../../recoil/atoms";
import { CheckerElement } from "./styles";
import { CheckerI, CheckerMode } from "./types";
import { useSetActiveCheckerBeatCells } from "../Cell/BrownCell/hooks";

export default function Checker({
  mode,
  columnIndex,
  rowIndex,
}: CheckerI): ReactElement | null {
  const checkerKey = createElementKey(rowIndex, columnIndex);
  const currentSideTurn = useRecoilValue(CurrentSideTurn);
  const isCheckerModeTurn = mode === currentSideTurn;

  const [checkerData, setCheckerData] = useRecoilState(AllCheckers(checkerKey));
  const [activeChecker, setActiveChecker] = useRecoilState(ActiveChecker);
  const setActiveCheckerBeatCells = useSetActiveCheckerBeatCells();
  const updateAllCheckersKeys = useSetRecoilState(AllCheckersKeys);

  useEffect(() => {
    if (checkerData) {
      setCheckerData({ ...checkerData, mode });
      updateAllCheckersKeys((state) => [...state, checkerKey]);
    }
  }, []);

  const handleCheckerClick = useCallback(() => {
    if (checkerData && isCheckerModeTurn) {
      setActiveChecker({ ...checkerData, mode });
      setActiveCheckerBeatCells();
    }
  }, [
    checkerData,
    setActiveChecker,
    mode,
    isCheckerModeTurn,
    setActiveCheckerBeatCells,
  ]);

  if (checkerData && checkerData.isAlive) {
    const {
      position: { xPos, yPos },
    } = checkerData;

    const isActiveChecker =
      !!activeChecker && activeChecker.name === checkerKey;

    return (
      <CheckerElement
        $mode={mode}
        $top={yPos}
        $left={xPos}
        onClick={handleCheckerClick}
        $isActive={isActiveChecker}
        $isCheckerModeTurn={isCheckerModeTurn}
      />
    );
  }

  return null;
}
