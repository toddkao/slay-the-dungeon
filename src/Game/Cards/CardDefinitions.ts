import cards from "../../Images/cards.png";
import cards5 from "../../Images/cards5.png";
import cards3 from "../../Images/cards3.png";
import { Card, CardEffectType, CardType } from "./Card";
import { StatusType } from "../Common/StatusBar";
// @ts-ignore
import fastAtk from "../../Audio/fastAtk.ogg";

export const spriteToCardSize = {
  cards: {
    CARD_WIDTH: 245,
    CARD_HEIGHT: 185,
  },
  cards5: {
    CARD_WIDTH: 250,
    CARD_HEIGHT: 185,
  },
  cards3: {
    CARD_WIDTH: 250,
    CARD_HEIGHT: 185,
  }
};

export const CARD_WIDTH = 245;
export const CARD_HEIGHT = 185;

const Strike = (id: string) =>
  new Card({
    id,
    name: "Strike",
    manaCost: 1,
    damage: 6,
    image: {
      src: cards5,
      position: [4, 2],
      width: spriteToCardSize["cards5"].CARD_WIDTH,
      height: spriteToCardSize["cards5"].CARD_HEIGHT,
    },
    type: CardType.Attack,
    effect: CardEffectType.SingleTarget,
    description: `Deal {} damage`,
    descriptionVariables: ["damage"],
    targetEnemy: true,
    audio: fastAtk,
  });

const Bash = (id: string) =>
  new Card({
    id,
    name: "Bash",
    manaCost: 2,
    damage: 8,
    status: {
      type: StatusType.vulnerable,
      amount: 2,
      degrades: true,
    },
    image: {
      src: cards3,
      position: [7, 3],
      width: spriteToCardSize["cards3"].CARD_WIDTH,
      height: spriteToCardSize["cards3"].CARD_HEIGHT,
    },
    type: CardType.Attack,
    effect: CardEffectType.SingleTarget,
    description: `Deal {} damage.\nApply 2 vulnerable.`,
    descriptionVariables: ["damage"], //TODO: how to change 2 to status.amount?
    targetEnemy: true,
  });

const Defend = (id: string) =>
  new Card({
    id,
    name: "Defend",
    manaCost: 1,
    block: 5,
    image: {
      src: cards,
      position: [6, 4],
      width: spriteToCardSize["cards"].CARD_WIDTH,
      height: spriteToCardSize["cards"].CARD_HEIGHT,
    },
    type: CardType.Skill,
    effect: CardEffectType.AddBlock,
    description: "Gain {} Block",
    descriptionVariables: ["block"],
    targetEnemy: false,
  });

export const cardList = { strike: Strike, defend: Defend, bash: Bash };
