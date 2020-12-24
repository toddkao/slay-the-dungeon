import { observer } from "mobx-react";
import styled, { css } from "styled-components";
import { Row } from "../../Layout";
import { Typography } from "../../Typography";
import { ShowCardsModal } from "./ShowCardsModal";
import redEnergy from "../../Images/redenergy.png";

export const HealthBar = observer((props: IHealthBarProps) => (
  <Bar>
    <HealthNumber>
      {props.health}
      {props.block ? `(${props.block})` : ""} / {props.maxHealth}
    </HealthNumber>
    <Health healthPercentage={(props.health / props.maxHealth) * 100} />
  </Bar>
));

export const ManaCost = styled(Typography)<{ notEnoughMana: boolean }>`
  background: url(${redEnergy});
  background-size: cover;
  font-size: 24px;
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
  text-shadow: -1px -1px 0 #000, 0 -1px 0 #000, 1px -1px 0 #000, 1px 0 0 #000,
    1px 1px 0 #000, 0 1px 0 #000, -1px 1px 0 #000, -1px 0 0 #000;
`;


const Bar = styled(Row)`
  position: relative;
  width: 100%;
  background-color: black;
  border-radius: 4px;
  height: 5px;
`;

const Health = styled.div<{ healthPercentage: number }>`
  position: absolute;
  ${({ healthPercentage }) => `width:${healthPercentage}%`};
  background-color: red;
  border-radius: 4px;
  height: 5px;
`;

const HealthNumber = styled(Typography).attrs({
  fontSize: 18,
})`
  position: absolute;
  transform: translateX(-50%);
  left: 50%;
  top: -13px;
  margin: 0;
  color: white;
  white-space: nowrap;
  z-index: 1;
  text-shadow: -1px -1px 0 #000, 0 -1px 0 #000, 1px -1px 0 #000, 1px 0 0 #000,
    1px 1px 0 #000, 0 1px 0 #000, -1px 1px 0 #000, -1px 0 0 #000;
  border-radius: 5px;
  padding: 3px;
`;

interface IHealthBarProps {
  health: number;
  block?: number;
  maxHealth: number;
}

export const CardsModal = ShowCardsModal;
