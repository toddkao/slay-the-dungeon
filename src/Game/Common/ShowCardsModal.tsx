import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";
import { Row } from "../../Layout";
import { Card } from "../Cards/Card";
import { Modal } from "./Modal";
import cancelButton from "../../Images/cancel-button.png";
import { RenderCard } from "../Cards/RenderCard";

const ReturnButton = styled.div`
  font-size: 30px;
  background: url(${cancelButton});
  text-shadow: -1px -1px 0 #000, 0 -1px 0 #000, 1px -1px 0 #000, 1px 0 0 #000,
    1px 1px 0 #000, 0 1px 0 #000, -1px 1px 0 #000, -1px 0 0 #000;
  color: white;
  width: 270px;
  height: 135px;
  position: absolute;
  bottom: 200px;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CardRow = styled(Row)`
  max-width: 1050px;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
  overflow-x: hidden;
  max-height: 85vh;
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
