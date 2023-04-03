import styled from "styled-components";
import { BaseCellStyles } from "../styles";

export const BrownCellContainer = styled.td<{ $isAvailableCell: boolean }>`
  ${BaseCellStyles}
  background-color: rgb(136, 125, 114);

  cursor: ${(props) => (props.$isAvailableCell ? "pointer" : "not-allowed")};
`;
