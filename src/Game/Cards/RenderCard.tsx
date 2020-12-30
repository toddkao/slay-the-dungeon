import { observer } from "mobx-react";
import React, { useRef } from "react";
import styled, { css } from "styled-components";
import { Typography } from "../../Typography";
import { BattleState } from "../Battle/BattleState";
import { CardState } from "./CardState";
import { ManaCost } from "../Common";
import cardImage from "../../Images/card.png";
import { PlayerState } from "../Entities/Player/PlayerState";

// @ts-ignore
import { Sprite } from "react-spritesheet";
import { horizontalCenterAbsolute, Row } from "../../Layout";
import { PullRelease } from "../Common/Draggable";
import { cardMap } from "./CardDefinitions";

export const RenderCard = observer(
  ({
    cardState,
    onClick,
    showIfCastable = false,
    draggable = false,
    calculateStatusesInCardText = false,
  }: {
    cardState: CardState;
    onClick?: () => void;
    showIfCastable?: boolean;
    draggable?: boolean;
    calculateStatusesInCardText?: boolean;
  }) => {
    const battleState = BattleState.get();
    const cardRef = useRef(null);

    cardState.ref = cardRef;

    if (!cardState?.get?.image) {
      return null;
    }
    const { src, position, width, height } = cardState.get.image;
    const [x, y] = position;

    const CardWrapper = draggable ? DraggableWrapper : UndraggableWrapper;

    const upgraded = cardState.get.upgraded;

    const selected = battleState.selectedCardId
      ? battleState.selectedCardId === cardState.get.id
      : false;

    const damage = Math.floor(
      ((cardMap?.[cardState.get.name]?.damage?.({
        selected,
        upgraded,
      }) ?? 0) +
        (calculateStatusesInCardText ? PlayerState.get().strength : 0)) *
        (calculateStatusesInCardText ? PlayerState.get().damageMultiplier : 1)
    );

    const block = Math.floor(
      ((cardMap?.[cardState.get.name]?.block?.({
        selected,
        upgraded,
      }) ?? 0) +
        (calculateStatusesInCardText ? PlayerState.get().dexterity : 0)) *
        (calculateStatusesInCardText ? PlayerState.get().blockMultiplier : 1)
    );

    return (
      <CardWrapper
        ref={cardRef}
        key={cardState.get.id}
        onClick={onClick}
        onDragStart={draggable ? cardState.select : undefined}
        onDrag={cardState.onDrag}
        onMouseUp={draggable ? cardState.onReleaseDrag : undefined}
        selected={cardState.get.id === battleState.selectedCardId}
        draggable={draggable}
      >
        <Image src={cardImage} />
        <ManaCost
          notEnoughMana={
            showIfCastable
              ? cardState.manaCost > battleState.currentMana
              : false
          }
        >
          {cardState.manaCost}
        </ManaCost>
        <RenderCardName outline>
          {cardState.get.name}
          {cardState.get.upgraded ? "+" : ""}
        </RenderCardName>
        <RenderCardType>{cardState.get.type}</RenderCardType>
        <CardTextContainer>
          <RenderCardText>
            {cardState.get.description({
              damage,
              block,
              upgraded,
              selected,
              includeStatuses: calculateStatusesInCardText,
              ...(calculateStatusesInCardText
                ? {
                    target: battleState.selectedMonsters?.[0],
                  }
                : {}),
            })}
          </RenderCardText>
        </CardTextContainer>
        <CardSpriteContainer>
          <Sprite
            filename={src}
            x={x * width}
            y={y * height}
            width={width}
            height={height}
          />
        </CardSpriteContainer>
      </CardWrapper>
    );
  }
);

const Image = styled.div<{ src: string }>`
  background: ${({ src }) => `url(${src})`};
  background-size: contain;
  background-repeat: no-repeat;
  width: 200px;
  height: 250px;
`;

const CardSpriteContainer = styled.div`
  z-index: -1;
  position: absolute;
  left: 46px;
  top: 55px;
  zoom: 0.58;
`;

const DraggableWrapper = styled(PullRelease)<{
  selected: boolean;
  draggable?: boolean;
}>`
  display: flex;
  flex-direction: column;
  position: relative;
  ${({ selected }) =>
    selected
      ? css`
          z-index: 9;
        `
      : ""};
`;

const UndraggableWrapper = styled(DraggableWrapper).attrs({
  as: "div",
})`
  transition: transform 0.2s;
  &:hover {
    z-index: 2;
    transform: scale(1.2);
  }
`;

const RenderCardName = styled(Typography)`
  ${horizontalCenterAbsolute};
  color: white;
  font-size: 16px;
  top: 17px;
  width: 100%;
  text-align: center;
`;

const RenderCardType = styled(Typography)`
  font-size: 55%;
  top: 53%;
  ${horizontalCenterAbsolute};
`;

const RenderCardText = styled(Typography).attrs({
  as: "pre",
})`
  font-size: 14px;
  color: white;
  font-weight: 100;
  line-height: 1.2;
`;

const CardTextContainer = styled(Row)`
  ${horizontalCenterAbsolute};
  text-align: center;
  align-items: center;
  justify-content: center;
  top: 58%;
  height: 90px;
  width: 115px;
`;
