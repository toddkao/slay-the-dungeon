import { observer } from "mobx-react";
import styled from "styled-components";
import { horizontalCenterAbsolute, Row } from "../../Layout";
import { Typography } from "../../Typography";

import block from "../../Images/combat/blockAnimation.png";

export const HealthBar = observer((props: IHealthBarProps) => (
  <Bar hasShield={!!props.block}>
    {!!props.block && (
      <BlockIcon>
        <Row align="center" justify="center" style={{height: '100%', width: '100%'}}>
          <BlockNumber fontSize={18} outline>
            {props.block}
          </BlockNumber>
        </Row>
      </BlockIcon>
    )}
    <HealthNumber fontSize={18} outline>
      {props.health} / {props.maxHealth}
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

const BlockIcon = styled.div`
  background: url(${block});
  background-size: contain;
  width: 50px;
  height: 50px;
  top: -20px;
  left: -20px;
  z-index: 1;
  position: absolute;
`;

const BlockNumber = styled(Typography)`
  color: white;
  white-space: nowrap;
  z-index: 1;
  line-height: 0;
`;

const Bar = styled(Row)<{hasShield?: boolean}>`
  position: relative;
  width: 100%;
  background-color: black;
  border-radius: 4px;
  height: 5px;
  ${({ hasShield }) => (hasShield ? `border: 2px solid lightblue` : "")};
`;

interface IHealthBarProps {
  health: number;
  block?: number;
  maxHealth: number;
}
