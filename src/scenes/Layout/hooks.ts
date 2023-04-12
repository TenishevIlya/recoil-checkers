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
  BrownCellsForCheckers,
  CurrentSideTurn,
} from "../../recoil/atoms";

export const useResetApp = (): (() => void) => {
  const resetTurn = useResetRecoilState(CurrentSideTurn);
  const resetActiveChecker = useResetRecoilState(ActiveChecker);
  const allCheckersKeys = useRecoilValue(AllCheckersKeys);
  const allBrownCellsKeys = useRecoilValue(AllBrownCellsKeys);

  const resetCheckers = useResetFamilyValuesByKeys();
  const resetCells = useResetFamilyValuesByKeys();

  const reset = (): void => {
    resetCheckers(allCheckersKeys);
    resetCells(allBrownCellsKeys);
    resetActiveChecker();
    resetTurn();
  };

  return reset;
};

export const useResetFamilyValuesByKeys = (): ((keys: string[]) => void) => {
  const resetFamilyValues = useRecoilTransaction_UNSTABLE(
    ({ reset }) =>
      (keys: string[]) => {
        keys.forEach((key) => {
          reset(AllCheckers(key));
          reset(AllBrownCells(key));
        });
      }
  );

  return resetFamilyValues;
};
