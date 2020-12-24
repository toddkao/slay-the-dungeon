import { observer } from "mobx-react";
import styled from "styled-components";
import { Row } from "../../Layout";
import strength from "../../Images/strength.png";
import dexterity from "../../Images/dexterity.png";
import vulnerable from "../../Images/vulnerable.png";
import { Typography } from "../../Typography";

const Wrapper = styled(Row)`
  gap: 20px;
  height: 30px;
`;

export enum StatusType {
  strength = "strength",
  dexterity = "dexterity",
  vulnerable = "vulnerable"
}

export const StatusTypeToIStatus = {
  [StatusType.strength]: { degrades: false },
  [StatusType.dexterity]: { degrades: false },
  [StatusType.vulnerable]: { degrades: true },
};

type IStatusIconMap = {
  [index in StatusType]: string;
};

const StatusIconMap: IStatusIconMap = {
  [StatusType.strength]: strength,
  [StatusType.dexterity]: dexterity,
  [StatusType.vulnerable]: vulnerable,
};

export interface IStatus {
  type: StatusType;
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
      <img src={StatusIconMap[status.type]} width={25} height={25} alt="status-icon" />
      <StatusAmount>{status.amount}</StatusAmount>
    </StatusWrapper>
  );
};
