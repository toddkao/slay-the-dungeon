import styled, { css } from "styled-components";
import { Typography } from "../../Typography";
import redEnergy from "../../Images/redenergy.png";

export const ManaCost = styled(Typography).attrs({
  fontSize: 24, 
  outline: true,
})<{ notEnoughMana: boolean }>`
  background: url(${redEnergy});
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  top: -15px;
  left: -5px;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  position: absolute;
  ${({ notEnoughMana }) =>
    notEnoughMana
      ? css`
          color: red;
        `
      : css`
          color: white;
        `};
`;
