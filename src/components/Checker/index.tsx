import React, { ReactElement } from "react";
import { BlackChecker, WhiteChecker } from "./styles";
import { CheckerI, CheckerMode } from "./types";

export default function Checker({ mode }: CheckerI): ReactElement {
  return mode === CheckerMode.black ? <BlackChecker /> : <WhiteChecker />;
}
