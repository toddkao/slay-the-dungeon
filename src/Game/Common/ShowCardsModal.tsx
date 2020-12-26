import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";
import { Row } from "../../Layout";
import { Card } from "../Cards/Card";
import { Modal } from "./Modal";

import { RenderCard } from "../Cards/RenderCard";
import { ReturnButton } from "../../Clickables";

export const CardRow = styled(Row)`
  max-width: 1050px;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
  overflow-x: hidden;
  max-height: 75vh;
  // @Todd 
  // leave some space for the zoom effect to not be cut off
  padding: 100px;
`;

interface IProps {
  cards: Card[];
  onClose: () => void;
}

export const ShowCardsModal = observer((props: IProps) => {
  return (
    <Modal>
      <ReturnButton onClick={props.onClose}>Return</ReturnButton>
      <CardRow>{props.cards.map((card) => <RenderCard cardState={card} />)}</CardRow>
    </Modal>
  );
});
