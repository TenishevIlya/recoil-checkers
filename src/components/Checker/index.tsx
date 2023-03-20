import React, { ReactElement } from "react";
import type { CheckerI } from "./types";
import checkerStyles from "./Checker.module.css";

export default function Checker({ mode }: CheckerI): ReactElement {
  const { blackChecker, whiteChecker } = checkerStyles;

  return <div className={mode === "black" ? blackChecker : whiteChecker} />;
}
