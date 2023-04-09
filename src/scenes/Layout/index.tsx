import React, { ReactElement } from "react";
import Table from "../../components/Table";
import { CurrentSideTurnDescription, LayoutContainer } from "./styles";
import { useRecoilValue } from "recoil";
import { CurrentSideTurn } from "../../recoil/atoms";

export default function Layout(): ReactElement {
  const currentSideTurn = useRecoilValue(CurrentSideTurn);

  return (
    <LayoutContainer>
      <CurrentSideTurnDescription>{`${currentSideTurn} turn`}</CurrentSideTurnDescription>
      <Table />
    </LayoutContainer>
  );
}
