import { ReactElement } from "react";
import Table from "../../components/Table";
import {
  Actions,
  CurrentSideTurnDescription,
  LayoutContainer,
  ResetButton,
} from "./styles";
import { useRecoilValue } from "recoil";
import { CurrentSideTurn } from "../../recoil/atoms";
import { useResetApp } from "./hooks";
import { getGameWinner } from "../../recoil/selectors";

export default function Layout(): ReactElement {
  const currentSideTurn = useRecoilValue(CurrentSideTurn);
  const resetAll = useResetApp();
  const gameWinner = useRecoilValue(getGameWinner);

  return (
    <LayoutContainer>
      <Actions>
        <CurrentSideTurnDescription>
          {gameWinner ? `${gameWinner} wins!` : `${currentSideTurn} turn`}
        </CurrentSideTurnDescription>
        <ResetButton onClick={resetAll}>Reset</ResetButton>
      </Actions>
      <Table />
    </LayoutContainer>
  );
}
