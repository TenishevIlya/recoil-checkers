import {
  useRecoilTransaction_UNSTABLE,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from "recoil";
import { createElementKeyFromObj } from "../../../helpers";
import {
  ActiveChecker,
  AllBrownCells,
  AllCheckers,
} from "../../../recoil/atoms";
import type { CellElement } from "../../../recoil/types";
import { getCrossCellKey, isAbleToBeat } from "./helpers";
import type { DefaultActionHookT } from "./types";

export const useUpdateActiveCheckerPosition =
  (): DefaultActionHookT<CellElement> => {
    const activeChecker = useRecoilValue(ActiveChecker);

    const setCheckerData = useSetRecoilState(
      AllCheckers(activeChecker?.name || "")
    );

    const updatePosition = (value: CellElement) => {
      if (activeChecker) {
        const { name, isAlive, mode } = activeChecker;

        setCheckerData({
          ...value,
          name,
          isAlive,
          mode,
        });
      }
    };

    return updatePosition;
  };

export const useUpdatePositionSideOperations =
  (): DefaultActionHookT<CellElement> => {
    const activeChecker = useRecoilValue(ActiveChecker);
    const resetActiveChecker = useResetRecoilState(ActiveChecker);
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
        resetActiveChecker();
      }
    };

    return sideEffects;
  };

export const useUpdateCellCheckerContain = (): ((
  associatedCellKey: string,
  keyToAddContain: string,
  keyToRemoveContain: string
) => void) => {
  const updater = useRecoilTransaction_UNSTABLE(
    ({ set }) =>
      (
        associatedCellKey: string,
        keyToAddContain: string,
        keyToRemoveContain: string
      ) => {
        set(AllBrownCells(keyToAddContain), (state) => {
          if (state) {
            return { ...state, associatedCellKey };
          }
          return null;
        });

        set(AllBrownCells(keyToRemoveContain), (state) => {
          if (state) {
            return { ...state, associatedCellKey: null };
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

        if (cellWithAssignedChecker?.associatedCellKey) {
          set(
            AllCheckers(cellWithAssignedChecker.associatedCellKey),
            (state) => {
              if (state) {
                return { ...state, isAlive: false };
              }

              return null;
            }
          );

          set(AllBrownCells(key), (state) => {
            if (state) {
              return { ...state, associatedCellKey: null };
            }

            return null;
          });
        }
      }
  );

  return checkBeatAction;
};
