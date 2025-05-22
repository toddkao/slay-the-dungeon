import React, { useState } from "react";
import styled from "styled-components";
import { Row } from "../../Layout";
import { CardState } from "../Cards/CardState";
import { Modal } from "./Modal";

import { RenderCard } from "../Cards/RenderCard";
import { PeekButton, ReturnButton } from "./Clickables";

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
  cards: CardState[];
  onClose: () => void;
  onFinishSelectingCards?: (cards: CardState[]) => void;
  cardsToSelect?: number;
  showReturnButton?: boolean;
  calculateStatusesInCardText?: boolean;
}

export const ShowCardsModal = (
  ({
    cards,
    onClose,
    onFinishSelectingCards,
    cardsToSelect,
    showReturnButton = true,
    calculateStatusesInCardText = false,
  }: IProps) => {
    const [hideModal, setHideModal] = useState(false);
    const [selectedCards, setSelectedCards] = useState<CardState[]>([]);

    const onSelectCard = (card: CardState) => {
      if (cardsToSelect) {
        const newSelected = [...selectedCards, card];
        setSelectedCards(newSelected);
        setTimeout(() => {
          if (newSelected.length === cardsToSelect) {
            onFinishSelectingCards?.(newSelected);
          }
        }, 0);
      }
    };

    const toggleHideModal = () => {
      setHideModal(!hideModal);
    };

    return (
      <>
        {!showReturnButton ? (
          <PeekButton onClick={() => toggleHideModal()} />
        ) : null}
        {!hideModal ? (
          <Modal>
            <>
              {showReturnButton ? (
                <ReturnButton onClick={onClose}>Return</ReturnButton>
              ) : null}
              <CardRow>
                {cards.map((card) => (
                  <RenderCard
                    cardState={card}
                    onClick={() => onSelectCard(card)}
                    draggable={false}
                    calculateStatusesInCardText={calculateStatusesInCardText}
                  />
                ))}
              </CardRow>
            </>
          </Modal>
        ) : null}
      </>
    );
  }
);
