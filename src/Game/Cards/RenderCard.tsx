import { observer } from "mobx-react";
import React, { useRef } from "react";
import styled, { css } from "styled-components";
import { Typography } from "../../Typography";
import { Battle } from "../Battle/Battle";
import { Card } from "./Card";
import { ManaCost } from "../Common";
import cardImage from "../../Images/card.png";
import { Player } from "../Entities/Player/Player";

// @ts-ignore
import { Sprite } from "react-spritesheet";
import { horizontalCenterAbsolute, Row } from "../../Layout";
import { PullRelease } from "../Common/Draggable";

export const RenderCard = observer(
  ({
    cardState,
    onClick,
    showIfCastable = true,
    draggable = true,
  }: {
    cardState: Card;
    onClick?: () => void;
    showIfCastable?: boolean;
    draggable?: boolean;
  }) => {
    const battleState = Battle.get();
    const cardRef = useRef(null);

    cardState.ref = cardRef;

    const { src, position, width, height } = cardState.get.image;
    const [x, y] = position;

    const CardWrapper = draggable ? DraggableWrapper : UndraggableWrapper;

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
              ? cardState.get.manaCost() > battleState.currentMana
              : false
          }
        >
          {cardState.get.manaCost()}
        </ManaCost>
        <RenderCardName outline>{cardState.get.name}{cardState.get.upgraded ? '+' : ''}</RenderCardName>
        <RenderCardType>{cardState.get.type}</RenderCardType>
        <CardTextContainer>
          <RenderCardText>{cardState.get.description()}</RenderCardText>
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
  as: 'div'
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
