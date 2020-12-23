import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";
import { Row } from "../../Layout";
import { Card } from "../Card";
import { Modal } from "./Modal";

const ReturnButton = styled.div`
  background-color: black;
  color: white;
  font-size: 20px;
  padding: 20px;
`;

const CardRow = styled(Row)`
  pointer-events: none;
  max-width: 850px;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
`;

interface IProps {
  cards: Card[];
  onClose: () => void;
}

export const ShowCardsModal = observer((props: IProps) => {
  console.log("show cards");
  return (
    <Modal>
      <ReturnButton onClick={props.onClose}>Return</ReturnButton>
      <CardRow>
        {props.cards.map((card) => card.render(`show-cards-${card.id}`))}
      </CardRow>
    </Modal>
  );
});
