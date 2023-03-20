import styled, { css } from "styled-components";

export const BaseChecker = css`
  border-radius: 50%;
  height: 100px;
  width: 100px;
`;

export const WhiteChecker = styled.div`
  ${BaseChecker}
  background-color: rgb(255, 255, 255);
`;

export const BlackChecker = styled.div`
  ${BaseChecker}
  background-color: rgb(0, 0, 0);
`;
