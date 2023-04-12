import styled from "styled-components";

export const LayoutContainer = styled.section`
  background-color: rgba(152, 157, 117, 0.5);
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const CurrentSideTurnDescription = styled.p`
  margin: 0;
  font-size: 30px;
  text-transform: capitalize;
`;

export const Actions = styled.section`
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 0 0 16px;
`;

export const ResetButton = styled.button`
  height: 30px;
`;
