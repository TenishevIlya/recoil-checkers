import { useRecoilValue, useResetRecoilState, useSetRecoilState } from "recoil";
import { createElementKey } from "../../../helpers";
import { ActiveChecker, AllCheckers } from "../../../recoil/atoms";
import { BaseTableElement } from "../../../recoil/types";

export const useUpdateActiveCheckerPosition = (): ((
  value: BaseTableElement
) => void) => {
  const activeChecker = useRecoilValue(ActiveChecker);
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
    setCheckerData(value);
    resetActiveChecker();
  };

  return updatePosition;
};
