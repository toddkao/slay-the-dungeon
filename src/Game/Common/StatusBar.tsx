import { observer } from "mobx-react";
import styled from "styled-components";
import { Row } from "../../Layout";
import strength from "../../Images/strength.png";
import strengthDown from "../../Images/strengthDown.png";
import dexterity from "../../Images/dexterity.png";
import vulnerable from "../../Images/vulnerable.png";
import weak from "../../Images/weak.png";
import { Typography } from "../../Typography";
import React from "react";
import { CardEffectType } from "../Cards/CardState";
import { buff1, debuff3 } from "../../Audio/Audio";

const Wrapper = styled(Row)`
  gap: 20px;
  height: 30px;
`;

export enum StatusType {
  STRENGTH,
  DEXTERITY,
  VULNERABLE,
  WEAK,
  STRENGTH_DOWN,
}

export const StatusTypeToIStatus = {
  [StatusType.STRENGTH]: { degrades: false, fleeting: false, audio: buff1 },
  [StatusType.DEXTERITY]: { degrades: false, fleeting: false, audio: debuff3 },
  [StatusType.VULNERABLE]: { degrades: true, fleeting: false, audio: debuff3 },
  [StatusType.WEAK]: { degrades: true, fleeting: false, audio: debuff3 },
  [StatusType.STRENGTH_DOWN]: {
    degrades: false,
    fleeting: true,
    audio: debuff3,
  },
};

type IStatusIconMap = {
  [index in StatusType]: string;
};

const StatusIconMap: IStatusIconMap = {
  [StatusType.STRENGTH]: strength,
  [StatusType.DEXTERITY]: dexterity,
  [StatusType.VULNERABLE]: vulnerable,
  [StatusType.WEAK]: weak,
  [StatusType.STRENGTH_DOWN]: strengthDown,
};

export interface IStatus {
  type: StatusType;
  target?: CardEffectType;
  degrades: boolean;
  fleeting?: boolean;
  audio?: string;
  amount: number;
}

interface IProps {
  statuses: IStatus[];
}

const StatusWrapper = styled.div`
  position: relative;
`;

const StatusAmount = styled(Typography)`
  position: absolute;
  right: -10px;
  top: 0;
  color: white;
`;

export const StatusBar = observer((props: IProps) => {
  return (
    <Wrapper>
      {props.statuses.map((status) => (
        <RenderStatus key={status.type} status={status} />
      ))}
    </Wrapper>
  );
});

const RenderStatus = ({ status }: { status: IStatus }) => {
  return (
    <StatusWrapper>
      <img
        src={StatusIconMap[status.type]}
        width={25}
        height={25}
        alt="status-icon"
        draggable={false}
      />
      <StatusAmount>{status.amount}</StatusAmount>
    </StatusWrapper>
  );
};
