import styled, { css } from "styled-components";
import cardImage from "../../Images/card.png";
import { Column } from "../../Layout";
import { Typography } from "../../Typography";
import React from "react";
import { ManaCost } from "../Common";
import { BattleState } from "../BattleState";
import { computed } from "mobx";
import { Player } from "../Entities/Player";
import { IStatus } from "../Common/StatusBar";
import { Howl } from "howler";

// @ts-ignore
import { Sprite } from "react-spritesheet";

export enum CardType {
  Attack = "Attack",
  Skill = "Skill",
}

export enum CardEffectType {
  SingleTarget,
  MultiTarget,
  AddBlock,
}

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

const CardWrapper = styled(Column)<{ selected: boolean }>`
  position: relative;
  ${({ selected }) =>
    selected
      ? css`
          transform: scale(1.5);
          z-index: 2;
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

export interface ICard {
  id: any;
  name: string;
  manaCost: number;
  type: CardType;
  effect: CardEffectType;
  damage?: number;
  status?: IStatus;
  block?: number;

  targetEnemy: boolean;

  description: string;
  descriptionVariables?: string[];
  // assets
  image: {
    src: string;
    position: [number, number];
    width: number;
    height: number;
  };
  audio?: string;
}

export class Card {
  constructor(private card: ICard) {}

  @computed
  get id() {
    return this.card.id;
  }

  @computed
  get targetEnemy() {
    return this.card.targetEnemy;
  }

  @computed
  get targetSelf() {
    return !this.card.targetEnemy;
  }

  @computed
  get manaCost() {
    return this.card.manaCost;
  }

  @computed
  get effect() {
    return this.card.effect;
  }

  @computed
  get block() {
    return this.card.block;
  }

  @computed
  get damage() {
    return this.card.damage;
  }

  @computed
  get status() {
    return this.card.status;
  }

  @computed
  get audioClip() {
    return this.card.audio;
  }

  public playAudioClip = () => {
    console.log(this.audioClip);
    if (this.audioClip) {
      const sound = new Howl({
        src: this.audioClip,
        volume: 0.5,
      });
      sound.play();
    }
  };

  render = (key: any) => {
    const battleState = new BattleState();
    const { position, width, height } = this.card.image;
    const [x, y] = position;
    return (
      <CardWrapper
        key={key}
        onClick={() => battleState.selectCard(this.card.id)}
        selected={this.card.id === battleState.selectedCardId}
      >
        <Image src={cardImage} />
        <ManaCost notEnoughMana={this.card.manaCost > battleState.currentMana}>
          {this.card.manaCost}
        </ManaCost>
        <RenderCardName>{this.card.name}</RenderCardName>
        <RenderCardType>{this.card.type}</RenderCardType>
        <RenderCardText>{this.parseCardText()}</RenderCardText>
        <CardSpriteContainer>
          <Sprite
            filename={this.card.image.src}
            x={x * width}
            y={y * height}
            width={width}
            height={height}
          />
        </CardSpriteContainer>
      </CardWrapper>
    );
  };

  parseCardText() {
    const player = new Player();
    let text = this.card.description;
    this.card.descriptionVariables?.forEach((variable) => {
      text = text.replace(
        "{}",
        (this.card as any)?.[variable] + (player as any)?.[`extra${variable}`]
      );
    });
    return text;
  }
}
