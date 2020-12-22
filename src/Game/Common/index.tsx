import styled from "styled-components";
import { Row } from "../../Layout";
import { Typography } from "../../Typography";

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

const HealthNumber = styled(Typography)`
  position: absolute;
  transform: translateX(-50%);
  left: 50%;
  top: -5px;
  margin: 0;
  color: white;
  z-index: 1;
`;

interface IHealthBarProps {
  health: number,
  maxHealth: number,
}

export const HealthBar = (props: IHealthBarProps) => (
  <Bar>
    <HealthNumber>
      {props.health} / {props.maxHealth}
    </HealthNumber>
    <Health healthPercentage={(props.health / props.maxHealth) * 100} />
  </Bar>
);
