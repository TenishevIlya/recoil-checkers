import React, { ReactElement } from "react";
import { BlackChecker, WhiteChecker } from "./styles";
import { CheckerI, CheckerMode } from "./types";

export default function Checker({ mode, left, top }: CheckerI): ReactElement {
  return mode === CheckerMode.black ? (
    <BlackChecker $top={top} $left={left} />
  ) : (
    <WhiteChecker $top={top} $left={left} />
  );
}
