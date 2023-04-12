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
} from "../../../recoil/atoms";
import type { CellElement } from "../../../recoil/types";
import { getCrossCellKey, isAbleToBeat } from "./helpers";
import type { DefaultActionHookT } from "./types";
import {
  canCheckerBeUsedForBeat,
  getPossibleCellsToBeat,
} from "../../../recoil/helpers";

export const useUpdateActiveCheckerPosition =
  (): DefaultActionHookT<CellElement> => {
    const [activeChecker, setActiveChecker] = useRecoilState(ActiveChecker);
    const setActiveCheckerBeatCells = useSetActiveCheckerBeatCells();

    const setCheckerData = useSetRecoilState(
      AllCheckers(activeChecker?.name || "")
    );

    const updatePosition = (value: CellElement) => {
      if (activeChecker) {
        const { rowIndex } = value.cellData;
        const {
          name,
          isAlive,
          mode,
          cellData: { rowIndex: activeCheckerRowIndex },
        } = activeChecker;
        const updatedData = { ...value, name, isAlive, mode };

        const isSimpleMove = Math.abs(activeCheckerRowIndex - rowIndex) === 1;

        setCheckerData(updatedData);

        if (isSimpleMove) {
          setActiveChecker(null);
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

        const crossCellKey = getCrossCellKey({
          currCellData: selectedCellData,
          prevCellData: activeCheckerCellData,
        });

        updateCellContain(
          activeChecker.name,
          createElementKeyFromObj(selectedCellData),
          createElementKeyFromObj(activeCheckerCellData)
        );
        if (isAbleToBeat(activeCheckerCellData, selectedCellData)) {
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
        set(AllBrownCells(keyToAddContain), (state) => {
          if (state) {
            return { ...state, associatedCheckerKey };
          }
          return null;
        });

        set(AllBrownCells(keyToRemoveContain), (state) => {
          if (state) {
            return { ...state, associatedCheckerKey: null };
          }
          return null;
        });
      }
  );

  return updater;
};

export const useBeatChecker = (): DefaultActionHookT<string> => {
  const checkBeatAction = useRecoilTransaction_UNSTABLE(
    ({ get, set }) =>
      (key: string) => {
        const cellWithAssignedChecker = get(AllBrownCells(key));

        if (cellWithAssignedChecker?.associatedCheckerKey) {
          const checkerToBeat = AllCheckers(
            cellWithAssignedChecker.associatedCheckerKey
          );

          set(checkerToBeat, (state) => {
            if (state) {
              return { ...state, isAlive: false };
            }

            return null;
          });

          set(CheckersAmountState, (state) => {
            const checkerToBeatValue = get(checkerToBeat);

            if (checkerToBeatValue && checkerToBeatValue.mode) {
              const { mode } = checkerToBeatValue;
              return {
                ...state,
                [mode]: state[mode] - 1,
              };
            }

            return state;
          });

          set(AllBrownCells(key), (state) => {
            if (state) {
              return { ...state, associatedCheckerKey: null };
            }

            return null;
          });
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
              if (cell && canCheckerBeUsedForBeat(activeChecker, cell, get)) {
                const { rowIndex, columnIndex } = cell.cellData;

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
