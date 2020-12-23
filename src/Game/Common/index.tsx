import { observer } from "mobx-react";
import styled from "styled-components";
import { Row } from "../../Layout";
import { Typography } from "../../Typography";
import { ShowCardsModal } from "./ShowCardsModal";

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
  top: -5px;
  margin: 0;
  color: white;
  white-space: nowrap;
  z-index: 1;
`;

interface IHealthBarProps {
  health: number,
  block?: number,
  maxHealth: number,
}

export const HealthBar = observer((props: IHealthBarProps) => (
  <Bar>
    <HealthNumber>
      {props.health}{props.block? `(${props.block})` : ''} / {props.maxHealth}
    </HealthNumber>
    <Health healthPercentage={(props.health / props.maxHealth) * 100} />
  </Bar>
));


export const ManaCost = styled(Typography).attrs({
  fontSize: 20,
})`
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  background-color: orange;
  position: absolute;
`;

export const CardsModal = ShowCardsModal;