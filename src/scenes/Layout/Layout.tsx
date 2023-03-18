import React, { ReactElement } from "react";
import layoutStyles from "./Layout.module.css";

export default function Layout(): ReactElement {
  return <section className={layoutStyles.layoutContainer}></section>;
}
