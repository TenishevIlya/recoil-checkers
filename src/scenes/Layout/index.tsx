import React, { ReactElement } from "react";
import Table from "../../components/Table";
import { LayoutContainer } from "./styles";

export default function Layout(): ReactElement {
  return (
    <LayoutContainer>
      <Table />
    </LayoutContainer>
  );
}
