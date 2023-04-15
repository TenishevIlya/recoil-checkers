import {
  useRecoilTransaction_UNSTABLE,
  useRecoilValue,
  useResetRecoilState,
} from "recoil";
import {
  ActiveChecker,
  AllBrownCells,
  AllBrownCellsKeys,
  AllCheckers,
  AllCheckersKeys,
  CheckersAmountState,
  CurrentSideTurn,
} from "../../recoil/atoms";
import type { AtomFamilyInstance } from "./types";
import type { CellElement, CheckerElement } from "../../recoil/types";

export const useResetApp = (): (() => void) => {
  const resetTurn = useResetRecoilState(CurrentSideTurn);
  const resetActiveChecker = useResetRecoilState(ActiveChecker);
  const allCheckersKeys = useRecoilValue(AllCheckersKeys);
  const allBrownCellsKeys = useRecoilValue(AllBrownCellsKeys);
  const resetCheckersAmount = useResetRecoilState(CheckersAmountState);

  const resetBrownCells =
    useResetFamilyValuesByKeys<CellElement>(AllBrownCells);
  const resetCheckers = useResetFamilyValuesByKeys<CheckerElement>(AllCheckers);

  const reset = (): void => {
    resetBrownCells(allCheckersKeys);
    resetCheckers(allBrownCellsKeys);
    resetActiveChecker();
    resetCheckersAmount();
    resetTurn();
  };

  return reset;
};

export const useResetFamilyValuesByKeys = <T>(
  atomFamily: AtomFamilyInstance<T>
): ((keys: string[]) => void) => {
  const resetFamilyValues = useRecoilTransaction_UNSTABLE(
    ({ reset }) =>
      (keys: string[]) => {
        keys.forEach((key) => {
          reset(atomFamily(key));
        });
      }
  );

  return resetFamilyValues;
};
