import {
  useRecoilState,
  useRecoilTransaction_UNSTABLE,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import { createElementKey, createElementKeyFromObj } from "../../../helpers";
import {
  ActiveChecker,
  ActiveCheckerBeatCells,
  AllBrownCells,
  AllCheckers,
  CheckersAmountState,
  CurrentSideTurn,
} from "../../../recoil/atoms";
import type { CellElement } from "../../../recoil/types";
import { canContinueBeat, getCrossCellKey } from "./helpers";
import type { DefaultActionHookT } from "./types";
import {
  canCheckerBeUsedForBeat,
  getPossibleCellsToBeat,
} from "../../../recoil/helpers";
import { isCellNeighbor } from "../../../recoil/helpers";
import { CheckerMode } from "../../Checker/types";

export const useUpdateActiveCheckerPosition =
  (): DefaultActionHookT<CellElement> => {
    const [activeChecker, setActiveChecker] = useRecoilState(ActiveChecker);
    const setActiveCheckerBeatCells = useSetActiveCheckerBeatCells();
    const setCurrentSideTurn = useSetRecoilState(CurrentSideTurn);

    const setCheckerData = useSetRecoilState(
      AllCheckers(activeChecker?.name || "")
    );

    const updatePosition = (value: CellElement) => {
      if (activeChecker) {
        const { cellData } = value;
        const {
          name,
          isAlive,
          mode,
          cellData: activeCheckerCellData,
        } = activeChecker;
        const updatedData = { ...value, name, isAlive, mode };

        const movedToNeighborCell = isCellNeighbor(
          activeCheckerCellData,
          cellData
        );

        setCheckerData(updatedData);

        if (movedToNeighborCell) {
          setActiveChecker(null);
          setCurrentSideTurn(
            mode === CheckerMode.white ? CheckerMode.black : CheckerMode.white
          );
        } else {
          setActiveChecker(updatedData);
          setActiveCheckerBeatCells();
        }
      }
    };

    return updatePosition;
  };

export const useUpdatePositionSideOperations =
  (): DefaultActionHookT<CellElement> => {
    const activeChecker = useRecoilValue(ActiveChecker);
    const updateCellContain = useUpdateCellCheckerContain();
    const beatChecker = useBeatChecker();

    const sideEffects = (selectedCell: CellElement): void => {
      if (activeChecker) {
        const { cellData: activeCheckerCellData } = activeChecker;
        const { cellData: selectedCellData } = selectedCell;

        updateCellContain(
          activeChecker.name,
          createElementKeyFromObj(selectedCellData),
          createElementKeyFromObj(activeCheckerCellData)
        );

        if (!isCellNeighbor(activeCheckerCellData, selectedCellData)) {
          const crossCellKey = getCrossCellKey({
            currCellData: selectedCellData,
            prevCellData: activeCheckerCellData,
          });

          beatChecker(crossCellKey);
        }
      }
    };

    return sideEffects;
  };

export const useUpdateCellCheckerContain = (): ((
  associatedCheckerKey: string,
  keyToAddContain: string,
  keyToRemoveContain: string
) => void) => {
  const updater = useRecoilTransaction_UNSTABLE(
    ({ set }) =>
      (
        associatedCheckerKey: string,
        keyToAddContain: string,
        keyToRemoveContain: string
      ) => {
        set(AllBrownCells(keyToAddContain), (state) => ({
          ...state,
          associatedCheckerKey,
        }));

        set(AllBrownCells(keyToRemoveContain), (state) => ({
          ...state,
          associatedCheckerKey: null,
        }));
      }
  );

  return updater;
};

export const useBeatChecker = (): DefaultActionHookT<string> => {
  const checkBeatAction = useRecoilTransaction_UNSTABLE(
    ({ get, set }) =>
      (key: string) => {
        const { associatedCheckerKey } = get(AllBrownCells(key));

        if (associatedCheckerKey) {
          const checkerToBeat = AllCheckers(associatedCheckerKey);

          set(checkerToBeat, (state) => ({ ...state, isAlive: false }));

          set(CheckersAmountState, (state) => {
            const { mode } = get(checkerToBeat);

            if (mode) {
              return {
                ...state,
                [mode]: state[mode] - 1,
              };
            }

            return state;
          });

          set(AllBrownCells(key), (state) => ({
            ...state,
            associatedCheckerKey: null,
          }));

          if (!canContinueBeat(get)) {
            set(ActiveChecker, null);
            set(CurrentSideTurn, (mode) =>
              mode === CheckerMode.white ? CheckerMode.black : CheckerMode.white
            );
          }
        }
      }
  );

  return checkBeatAction;
};

export const useSetActiveCheckerBeatCells = (): (() => void) => {
  const updateCellsToBeat = useRecoilTransaction_UNSTABLE(
    ({ get, set }) =>
      () => {
        const activeChecker = get(ActiveChecker);

        if (activeChecker) {
          const possibleCellsToBeat = getPossibleCellsToBeat(
            activeChecker,
            get
          );

          const finalCellsToBeat: string[] = [];

          if (possibleCellsToBeat.length) {
            possibleCellsToBeat.forEach((cell) => {
              const { cellData } = cell;

              if (canCheckerBeUsedForBeat(activeChecker, cell, get)) {
                const { rowIndex, columnIndex } = cellData;

                finalCellsToBeat.push(createElementKey(rowIndex, columnIndex));
              }
            });

            set(ActiveCheckerBeatCells, finalCellsToBeat);
          }
        }
      }
  );

  return updateCellsToBeat;
};
