import {
  useRecoilTransaction_UNSTABLE,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from "recoil";
import { createElementKey } from "../../../helpers";
import {
  ActiveChecker,
  AllBrownCells,
  AllCheckers,
} from "../../../recoil/atoms";
import { BaseTableElement } from "../../../recoil/types";

export const useUpdateActiveCheckerPosition = (): ((
  value: BaseTableElement
) => void) => {
  const activeChecker = useRecoilValue(ActiveChecker);
  const updateCellContain = useUpdateCellCheckerContain();

  let activeCheckerKey: string;

  if (activeChecker) {
    const {
      cellData: { columnIndex, rowIndex },
    } = activeChecker;

    activeCheckerKey = createElementKey(rowIndex, columnIndex);
  } else {
    activeCheckerKey = "";
  }

  const setCheckerData = useSetRecoilState(AllCheckers(activeCheckerKey));
  const resetActiveChecker = useResetRecoilState(ActiveChecker);

  const updatePosition = (value: BaseTableElement) => {
    if (activeChecker) {
      const { rowIndex: rowIndexForAdd, columnIndex: columnIndexForAdd } =
        value.cellData;
      const { rowIndex: rowIndexForRemove, columnIndex: columnIndexForRemove } =
        activeChecker.cellData;

      setCheckerData({ ...value, mode: activeChecker.mode });
      updateCellContain(
        createElementKey(rowIndexForAdd, columnIndexForAdd),
        createElementKey(rowIndexForRemove, columnIndexForRemove)
      );
      resetActiveChecker();
    }
  };

  return updatePosition;
};

export const useUpdateCellCheckerContain = (): ((
  keyToAddContain: string,
  keyToRemoveContain: string
) => void) => {
  const updater = useRecoilTransaction_UNSTABLE(
    ({ set }) =>
      (keyToAddContain: string, keyToRemoveContain: string) => {
        set(AllBrownCells(keyToAddContain), (state) => {
          if (state) {
            return { ...state, containChecker: true };
          }
          return null;
        });

        set(AllBrownCells(keyToRemoveContain), (state) => {
          if (state) {
            return { ...state, containChecker: false };
          }
          return null;
        });
      }
  );

  return updater;
};
