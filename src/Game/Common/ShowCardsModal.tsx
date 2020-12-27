import { observer } from "mobx-react";
import React, { useState } from "react";
import styled from "styled-components";
import { Row } from "../../Layout";
import { Card } from "../Cards/Card";
import { Modal } from "./Modal";

import { RenderCard } from "../Cards/RenderCard";
import { ReturnButton } from "../../Clickables";
import { Battle } from "../Battle/Battle";

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
  onFinishSelectingCards?: (cards: Card[]) => void;
  cardsToSelect?: number;
}

export const ShowCardsModal = observer(
  ({ cards, onClose, onFinishSelectingCards, cardsToSelect }: IProps) => {
    const [selectedCards, setSelectedCards] = useState<Card[]>([]);

    const onSelectCard = (card: Card) => {
      if (cardsToSelect) {
        setSelectedCards?.([...selectedCards, card]);
        if (selectedCards.length === cardsToSelect) {
          onFinishSelectingCards?.(selectedCards);
          Battle.get().callNextAction();
        }
      }
    };
    return (
      <Modal>
        <ReturnButton onClick={onClose}>Return</ReturnButton>
        <CardRow>
          {cards.map((card) => (
            <RenderCard
              cardState={card}
              onClick={() => onSelectCard(card)}
              draggable={false}
            />
          ))}
        </CardRow>
      </Modal>
    );
  }
);
