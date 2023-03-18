import React, { ReactElement } from "react";
import Table from "../../components/Table";
import layoutStyles from "./Layout.module.css";

export default function Layout(): ReactElement {
  return (
    <section className={layoutStyles.layoutContainer}>
      <Table />
    </section>
  );
}
