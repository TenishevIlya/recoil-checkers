import styled, { css } from "styled-components";

export const BaseChecker = css`
  border-radius: 50%;
  height: 100px;
  width: 100px;
  position: absolute;
`;

export const WhiteChecker = styled.div<{ $top: number; $left: number }>`
  ${BaseChecker}
  background-color: rgb(255, 255, 255);
  top: ${({ $top }) => $top}px;
  left: ${({ $left }) => $left}px;
`;

export const BlackChecker = styled.div<{ $top: number; $left: number }>`
  ${BaseChecker}
  background-color: rgb(0, 0, 0);
  top: ${({ $top }) => $top}px;
  left: ${({ $left }) => $left}px;
`;
