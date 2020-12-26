import { observer } from "mobx-react";
import styled from "styled-components";
import { horizontalCenterAbsolute, Row } from "../../Layout";
import { Typography } from "../../Typography";
import React from 'react';

export const HealthBar = observer((props: IHealthBarProps) => (
  <Bar>
    <HealthNumber fontSize={18} outline>
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

const HealthNumber = styled(Typography)`
  ${horizontalCenterAbsolute};
  top: -13px;
  margin: 0;
  color: white;
  white-space: nowrap;
  z-index: 1;
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