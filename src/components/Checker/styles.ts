import styled from "styled-components";
import { CheckerMode } from "./types";

export const CheckerElement = styled.div<{
  $isActive: boolean;
  $isCheckerModeTurn: boolean;
  $top: number;
  $left: number;
  $mode: CheckerMode;
}>`
  border-radius: 50%;
  height: 100px;
  width: 100px;
  position: absolute;
  top: ${({ $top }) => $top}px;
  left: ${({ $left }) => $left}px;
  box-sizing: border-box;
  background-color: ${(props) =>
    props.$mode === CheckerMode.black ? "rgb(0, 0, 0)" : "rgb(255, 255, 255)"};
  transition: top 0.5s, left 0.5s;
  cursor: ${({ $isCheckerModeTurn }) =>
    $isCheckerModeTurn ? "pointer" : "not-allowed"};

  border: ${({ $isActive }) => $isActive && "4px solid blue"};
`;
