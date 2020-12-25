import { observer } from "mobx-react";
import React from "react";
import { useSpring, animated } from "react-spring";
import { useDrag } from "react-use-gesture";
import styled, { css } from "styled-components";
import { Typography } from "../../Typography";
import { Battle } from "../Battle/Battle";
import { Card } from "./Card";
import { ManaCost } from "../Common";
import cardImage from "../../Images/card.png";
import { Player } from "../Entities/Player/Player";

// @ts-ignore
import { Sprite } from "react-spritesheet";

export const RenderCard = observer(({ cardState }: { cardState: Card }) => {
  const battleState = new Battle();

  const parseCardText = () => {
    const player = new Player();
    let text = cardState.get.description;
    cardState.get.descriptionVariables?.forEach((variable) => {
      text = text.replace(
        "{}",
        (cardState as any)?.get?.[variable] +
        (player as any)?.[`extra${variable}`]
      );
    });
    return text;
  };

  const [props, set] = useSpring(() => ({
    x: 0,
    y: 0,
    scale: 1,
  }));

  // @ts-ignore
  const bind = useDrag(({ down, movement: [x, y] }) => {
    set({
      x: down ? x : 0,
      y: down ? y : 0,
      scale: down ? 1.2 : 1,
      immediate: down,
    });
  });

  const { src, position, width, height } = cardState.get.image;
  const [x, y] = position;

  return (
    <CardWrapper
      key={cardState.get.id}
      onClick={cardState.select}
      selected={cardState.get.id === battleState.selectedCardId}
      {...bind()}
      style={props}
    >
      <Image src={cardImage} />
      <ManaCost
        notEnoughMana={cardState.get.manaCost > battleState.currentMana}
      >
        {cardState.get.manaCost}
      </ManaCost>
      <RenderCardName>{cardState.get.name}</RenderCardName>
      <RenderCardType>{cardState.get.type}</RenderCardType>
      <RenderCardText>{parseCardText()}</RenderCardText>
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
});


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

const CardWrapper = styled(animated.div) <{ selected: boolean }>`
  display: flex;
  flex-direction: column;
  position: relative;
  ${({ selected }) =>
    selected
      ? css`
          transform: scale(1.5);
          z-index: 2;
          outline:5px solid green;
        `
      : ""};
  transition: transform 0.2s;
  &:hover {
    z-index: 2;
    transform: scale(1.5);
  }
`;

const RenderCardName = styled(Typography)`
  color: white;
  text-shadow: -1px -1px 0 #000, 0 -1px 0 #000, 1px -1px 0 #000, 1px 0 0 #000,
    1px 1px 0 #000, 0 1px 0 #000, -1px 1px 0 #000, -1px 0 0 #000;
  font-size: 16px;
  top: 17px;
  transform: translateX(-50%);
  left: 50%;
  position: absolute;
`;

const RenderCardType = styled(Typography)`
  font-size: 55%;
  top: 53%;
  transform: translateX(-50%);
  left: 50%;
  position: absolute;
`;

const RenderCardText = styled(Typography)`
  text-align: center;
  font-size: 16px;
  color: white;
  top: 65%;
  transform: translateX(-50%);
  left: 50%;
  position: absolute;
  width: 65%;
`;
