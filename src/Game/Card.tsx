import styled from "styled-components";
import cardImage from "../Images/card.png";
import strike from "../Images/strike.png";
import defend from "../Images/defend.png";
import { Column } from "../Layout";
import { Typography } from "../Typography";
import React from "react";
import { ManaCost } from "./Common";
import { BattleState } from "./BattleState";
import { computed } from "mobx";
import { Player } from "./PlayerState";

export enum CardType {
  Attack = "Attack",
  Skill = "Skill",
}

export enum CardEffectType {
  SingleTargetAttack,
  AddBlock,
}

const Image = styled.div<{ src: string }>`
  background: ${({ src }) => `url(${src})`};
  background-size: contain;
  background-repeat: no-repeat;
  width: 200px;
  height: 250px;
`;

const CardImage = styled(Image)`
  z-index: -1;
  position: absolute;
  width: 150px;
  height: 219px;
  left: 20px;
  top: 34px;
`;

const CardWrapper = styled(Column)<{ selected: boolean }>`
  position: relative;
  ${({ selected }) => (selected ? `outline: 2px solid green;` : "")};
  &:hover {
    outline: 2px solid green;
  }
`;

const RenderCardName = styled(Typography)`
  font-size: 16px;
  top: 7%;
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
  block?: number;
  image: string;
  targetEnemy: boolean;

  description: string;
  descriptionVariables?: string[];
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

  render = (key: any) => {
    const battleState = new BattleState();
    return (
      <CardWrapper
        key={key}
        onClick={() => battleState.selectCard(this.card.id)}
        selected={this.card.id === battleState.selectedCardId}
      >
        <Image src={cardImage} />
        <ManaCost>{this.card.manaCost}</ManaCost>
        <RenderCardName>{this.card.name}</RenderCardName>
        <RenderCardType>{this.card.type}</RenderCardType>
        <RenderCardText>{this.parseCardText()}</RenderCardText>
        <CardImage src={this.card.image} />
      </CardWrapper>
    );
  };

  parseCardText() {
    const player = new Player();
    let text = this.card.description;
    this.card.descriptionVariables?.forEach((variable) => {
      text = text.replace(
        "{}",
        (this.card as any)?.[variable] + (player as any)?.[variable]
      );
    });
    return text;
  }
}

export const Strike = (id: string) =>
  new Card({
    id,
    name: "Strike",
    manaCost: 1,
    damage: 6,
    image: strike,
    type: CardType.Attack,
    effect: CardEffectType.SingleTargetAttack,
    description: `Deal {} damage`,
    descriptionVariables: ["damage"],
    targetEnemy: true,
  });

export const Defend = (id: string) =>
  new Card({
    id,
    name: "Defend",
    manaCost: 1,
    block: 5,
    image: defend,
    type: CardType.Skill,
    effect: CardEffectType.AddBlock,
    description: "Gain {} Block",
    descriptionVariables: ["block"],
    targetEnemy: false,
  });
