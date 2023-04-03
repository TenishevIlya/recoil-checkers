import styled, { css } from "styled-components";

export const BaseCellStyles = css`
  width: 100px;
  height: 100px;
  box-sizing: border-box;
  border: 1px solid rgb(0, 0, 0);
  cursor: pointer;
  display: inline-flex;
  justify-content: center;
  align-items: center;
`;

export const BeigeCell = styled.td`
  ${BaseCellStyles}
  background-color: rgb(235, 226, 214);
  cursor: not-allowed;
`;
