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
  CheckersAmountState,
  CurrentSideTurn,
} from "../../recoil/atoms";
import type { AtomFamilyInstance } from "./types";
import type { CellElement, CheckerElement } from "../../recoil/types";
import { TableDimensions } from "../../recoil/atoms";
import { createElementKey } from "../../helpers";

export const useResetApp = (): (() => void) => {
  const resetTurn = useResetRecoilState(CurrentSideTurn);
  const resetActiveChecker = useResetRecoilState(ActiveChecker);
  const allCheckersKeys = useRecoilValue(AllCheckersKeys);
  const allBrownCellsKeys = useRecoilValue(AllBrownCellsKeys);
  const resetCheckersAmount = useResetRecoilState(CheckersAmountState);
  const associatedCheckerSetter = useSetAssociatedCheckerOnReset();

  const resetBrownCells =
    useResetFamilyValuesByKeys<CellElement>(AllBrownCells);
  const resetCheckers = useResetFamilyValuesByKeys<CheckerElement>(AllCheckers);

  const reset = (): void => {
    resetBrownCells(allBrownCellsKeys);
    resetCheckers(allCheckersKeys);
    resetActiveChecker();
    resetCheckersAmount();
    resetTurn();
    associatedCheckerSetter();
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

export const useSetAssociatedCheckerOnReset = (): (() => void) => {
  const associatedCheckerSetter = useRecoilTransaction_UNSTABLE(
    ({ get, set }) =>
      () => {
        const { rows, columns } = get(TableDimensions);
        const { blackCheckersCells, whiteCheckersCells } = get(
          BrownCellsForCheckers(createElementKey(rows, columns))
        );

        [...whiteCheckersCells, ...blackCheckersCells].forEach(
          ({ columnIndex, rowIndex }) =>
            set(
              AllBrownCells(createElementKey(rowIndex, columnIndex)),
              (state) => ({
                ...state,
                associatedCheckerKey: createElementKey(rowIndex, columnIndex),
              })
            )
        );
      }
  );

  return associatedCheckerSetter;
};
