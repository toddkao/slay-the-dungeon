import { observer } from "mobx-react";
import styled from "styled-components";
import { Row } from "../../Layout";
import strength from "../../Images/strength.png";
import dexterity from "../../Images/dexterity.png";
import vulnerable from "../../Images/vulnerable.png";
import weak from "../../Images/weak.png";
import { Typography } from "../../Typography";
import React from "react";
import { CardEffectType } from "../Cards/Card";

const Wrapper = styled(Row)`
  gap: 20px;
  height: 30px;
`;

export enum StatusType {
  STRENGTH,
  DEXTERITY,
  VULNERABLE,
  WEAK,
}

export const StatusTypeToIStatus = {
  [StatusType.STRENGTH]: { degrades: false },
  [StatusType.DEXTERITY]: { degrades: false },
  [StatusType.VULNERABLE]: { degrades: true },
  [StatusType.WEAK]: { degrades: true },
};

type IStatusIconMap = {
  [index in StatusType]: string;
};

const StatusIconMap: IStatusIconMap = {
  [StatusType.STRENGTH]: strength,
  [StatusType.DEXTERITY]: dexterity,
  [StatusType.VULNERABLE]: vulnerable,
  [StatusType.WEAK]: weak,
};

export interface IStatus {
  type: StatusType;
  target?: CardEffectType;
  degrades: boolean;
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
