import { observer } from "mobx-react";
import styled from "styled-components";
import { Row } from "../../Layout";
import { Typography } from "../../Typography";

export const HealthBar = observer((props: IHealthBarProps) => (
  <Bar>
    <HealthNumber>
      {props.health}
      {props.block ? `(${props.block})` : ""} / {props.maxHealth}
    </HealthNumber>
    <Health healthPercentage={(props.health / props.maxHealth) * 100} />
  </Bar>
));


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

const Bar = styled(Row)`
  position: relative;
  width: 100%;
  background-color: black;
  border-radius: 4px;
  height: 5px;
`;

interface IHealthBarProps {
  health: number;
  block?: number;
  maxHealth: number;
}