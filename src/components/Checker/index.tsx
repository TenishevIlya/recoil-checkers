import { ReactElement, useCallback, useEffect } from "react";
import { useRecoilState } from "recoil";
import { createElementKey } from "../../helpers";
import { ActiveChecker, AllCheckers } from "../../recoil/atoms";
import { CheckerElement } from "./styles";
import { CheckerI } from "./types";

export default function Checker({
  mode,
  columnIndex,
  rowIndex,
}: CheckerI): ReactElement | null {
  const checkerKey = createElementKey(rowIndex, columnIndex);

  const [checkerData, setCheckerData] = useRecoilState(AllCheckers(checkerKey));
  const [activeChecker, setActiveChecker] = useRecoilState(ActiveChecker);

  useEffect(() => {
    if (checkerData) {
      setCheckerData({ ...checkerData, mode });
    }
  }, []);

  const handleCheckerClick = useCallback(() => {
    if (checkerData) {
      setActiveChecker({ ...checkerData, mode });
    }
  }, [checkerData, setActiveChecker, mode]);

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
      />
    );
  }

  return null;
}
