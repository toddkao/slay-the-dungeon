import cards1 from "../../Images/cards1.jpg";
import cards2 from "../../Images/cards2.jpg";
import cards3 from "../../Images/cards3.jpg";
import cards4 from "../../Images/cards4.jpg";
import cards5 from "../../Images/cards5.jpg";
import {
  CardState,
  CardEffectType,
  CardType,
  ICard,
  IEvaluatedCardProperty,
} from "./CardState";
import { StatusType } from "../Common/StatusBar";
import { BattleState, IBattleState, PileOfCards } from "../Battle/BattleState";
import { groupBy, uniqueId } from "lodash";
import { PlayerState } from "../Entities/Player/PlayerState";
import { addBlock, fastAtk, heavyAtk, upgradeCard } from "../../Audio/Audio";
import { playAudioClip } from "../Common/utility";

export enum CardRarity {
  STARTER,
  COMMON,
  UNCOMMON,
  RARE,
}

interface ISpriteToCardSize {
  [index: string]: { CARD_WIDTH: number; CARD_HEIGHT: number };
}

export const spriteToCardSize: ISpriteToCardSize = {
  cards1: {
    CARD_WIDTH: 245,
    CARD_HEIGHT: 185,
  },
  cards2: {
    CARD_WIDTH: 245,
    CARD_HEIGHT: 185,
  },
  cards3: {
    CARD_WIDTH: 250,
    CARD_HEIGHT: 185,
  },
  cards4: {
    CARD_WIDTH: 250,
    CARD_HEIGHT: 190,
  },
  cards5: {
    CARD_WIDTH: 250,
    CARD_HEIGHT: 185,
  },
};

const getImage = ({
  sheetNumber,
  position,
}: {
  sheetNumber: number;
  position: [number, number];
}) => {
  const src = "cards" + sheetNumber;
  let path;
  switch (sheetNumber) {
    case 1:
      path = cards1;
      break;
    case 2:
      path = cards2;
      break;
    case 3:
      path = cards3;
      break;
    case 4:
      path = cards4;
      break;
    case 5:
      path = cards5;
      break;
    default:
      throw new Error(`Expecting sheet number of 1-5, got ${sheetNumber}`);
  }

  return {
    src: path,
    position,
    width: spriteToCardSize[src].CARD_WIDTH,
    height: spriteToCardSize[src].CARD_HEIGHT,
  };
};
interface ICardMap {
  [index: string]: ICard;
}

const singleTargetDamage = (damage: number, selected?: boolean) =>
  BattleState.calculateDamage({
    damage,
    target: selected ? BattleState.get().selectedMonsters?.[0] : undefined,
  });

export const cardMap: ICardMap = {
  Bash: {
    name: "Bash",
    rarity: CardRarity.STARTER,
    manaCost: () => 2,
    upgraded: false,
    status: (upgraded = false) => ({
      type: StatusType.VULNERABLE,
      target: CardEffectType.SPECIFIC_ENEMY,
      amount: upgraded ? 3 : 2,
      degrades: true,
    }),
    image: getImage({ sheetNumber: 3, position: [7, 3] }),
    type: CardType.ATTACK,
    effect: CardEffectType.SPECIFIC_ENEMY,
    damage: (prop: IEvaluatedCardProperty) => (prop.upgraded ? 10 : 8),
    description: (props: IEvaluatedCardProperty) =>
      `Deal ${singleTargetDamage(
        props.damage ?? 0,
        props.selected
      )} damage.\nApply ${
        cardMap["Bash"].status?.(props.upgraded).amount
      } vulnerable.`,
    audio: [heavyAtk],
  },
  Defend: {
    name: "Defend",
    rarity: CardRarity.STARTER,
    manaCost: () => 1,
    upgraded: false,
    block: (prop: IEvaluatedCardProperty) => (prop.upgraded ? 8 : 5),
    image: getImage({ sheetNumber: 1, position: [6, 4] }),
    type: CardType.SKILL,
    effect: CardEffectType.SELF,
    description: (props: IEvaluatedCardProperty) =>
      `Gain ${props.block} Block.`,
    audio: [addBlock],
  },
  Strike: {
    name: "Strike",
    rarity: CardRarity.STARTER,
    upgraded: false,
    manaCost: () => 1,
    damage: (prop: IEvaluatedCardProperty) => (prop.upgraded ? 9 : 6),
    image: getImage({ sheetNumber: 5, position: [4, 2] }),
    type: CardType.ATTACK,
    effect: CardEffectType.SPECIFIC_ENEMY,
    description: (props: IEvaluatedCardProperty) =>
      `Deal ${singleTargetDamage(props.damage ?? 0, props.selected)} damage.`,
    audio: [fastAtk],
  },
  Anger: {
    name: "Anger",
    rarity: CardRarity.COMMON,
    upgraded: false,
    manaCost: () => 0,
    damage: (prop: IEvaluatedCardProperty) => (prop.upgraded ? 8 : 6),
    image: getImage({ sheetNumber: 3, position: [4, 3] }),
    specialEffect: (upgraded = false) => {
      const battle = BattleState.get();
      if (!battle.discardPile) {
        return;
      }
      battle.discardPile = [
        ...battle.discardPile,
        new CardState({ name: "Anger", id: uniqueId(), upgraded }),
      ];
    },
    type: CardType.ATTACK,
    effect: CardEffectType.SPECIFIC_ENEMY,
    description: (props: IEvaluatedCardProperty) =>
      `Deal ${singleTargetDamage(
        props.damage ?? 0,
        props.selected
      )} damage.\nAdd a copy of this card\ninto your discard pile.`,
    audio: [heavyAtk], //TODO: sound effect
  },
  Armament: {
    name: "Armament",
    rarity: CardRarity.COMMON,
    manaCost: () => 1,
    upgraded: false,
    block: () => 5,
    specialEffect: (upgraded?: boolean) => {
      if (upgraded) {
        BattleState.get().currentHand.forEach((card) => {
          card.upgradeCard();
          playAudioClip(upgradeCard);
        });
      }
    },
    cardSelection: (upgraded = false) =>
      upgraded
        ? undefined
        : {
            amount: 1,
            from: () => {
              return BattleState.get().currentHand.filter(
                (card) => card.id !== BattleState.get().selectedCardId
              );
            },
            selectCards: (cards: CardState[]) => {
              if (cards.length > 1) {
                throw new Error("Armament can only select 1 card!");
              }
              BattleState.get().currentHand.forEach((card) => {
                if (card.id === cards[0]?.get?.id) {
                  card.upgradeCard();
                }
              });
              playAudioClip(upgradeCard);
              BattleState.get().callNextAction();
            },
          },
    image: getImage({ sheetNumber: 1, position: [0, 9] }),
    type: CardType.SKILL,
    effect: CardEffectType.SELF,
    description: (props: IEvaluatedCardProperty) =>
      `Gain ${props.block} Block.\nUpgrade ${
        props.upgraded ? "all cards" : "a card"
      } in your\nhand for the rest of \nthe combat.`,
    audio: [addBlock], //TODO: sound effect
  },
  "Body Slam": {
    name: "Body Slam",
    rarity: CardRarity.COMMON,
    upgraded: false,
    manaCost: (upgraded = false) => (upgraded ? 0 : 1),
    damage: () => PlayerState.get().block,
    image: getImage({ sheetNumber: 3, position: [5, 2] }),
    type: CardType.ATTACK,
    effect: CardEffectType.SPECIFIC_ENEMY,
    description: () => `Deal damage equal to\nyour block`,
    audio: [heavyAtk], //TODO: sound effect
  },
  Clash: {
    name: "Clash",
    rarity: CardRarity.COMMON,
    manaCost: () => 0,
    upgraded: false,
    damage: (prop: IEvaluatedCardProperty) => (prop.upgraded ? 18 : 14),
    prerequisite: (battleState: IBattleState) => {
      return battleState.currentHand.every(
        (card) => card.get.type === CardType.ATTACK
      );
    },
    image: getImage({ sheetNumber: 3, position: [4, 1] }),
    type: CardType.ATTACK,
    effect: CardEffectType.SPECIFIC_ENEMY,
    description: (props: IEvaluatedCardProperty) =>
      `Can only be played if\nevery card in your\nhand is an Attack.\nDeal ${singleTargetDamage(
        props.damage ?? 0,
        props.selected
      )} damage.`,
    audio: [heavyAtk], //TODO: sound effect
  },
  Cleave: {
    name: "Cleave",
    rarity: CardRarity.COMMON,
    upgraded: false,
    manaCost: () => 1,
    damage: (prop: IEvaluatedCardProperty) => (prop.upgraded ? 11 : 8),
    image: getImage({ sheetNumber: 3, position: [6, 1] }),
    type: CardType.ATTACK,
    effect: CardEffectType.ALL_ENEMIES,
    description: (props: IEvaluatedCardProperty) =>
      `Deal ${props.damage} damage to ALL\n enemies.`,
    audio: [heavyAtk], //TODO: sound effect
  },
  Clothesline: {
    name: "Clothesline",
    rarity: CardRarity.COMMON,
    upgraded: false,
    manaCost: () => 2,
    damage: (prop: IEvaluatedCardProperty) => (prop.upgraded ? 14 : 12),
    status: (upgraded = false) => ({
      type: StatusType.WEAK,
      target: CardEffectType.SPECIFIC_ENEMY,
      amount: upgraded ? 3 : 2,
      degrades: true,
    }),
    image: getImage({ sheetNumber: 3, position: [7, 1] }),
    type: CardType.ATTACK,
    effect: CardEffectType.SPECIFIC_ENEMY,
    description: (props: IEvaluatedCardProperty) =>
      `Deal ${singleTargetDamage(
        props.damage ?? 0,
        props.selected
      )} damage.\nApply ${
        cardMap["Clothesline"].status?.(props.upgraded).amount
      } Weak.`,
    audio: [heavyAtk], //TODO: sound effect
  },
  Flex: {
    name: "Flex",
    rarity: CardRarity.COMMON,
    upgraded: false,
    manaCost: () => 0,
    image: getImage({ sheetNumber: 1, position: [0, 0] }),
    specialEffect: (upgraded = false) => {
      PlayerState.get().addStatus(StatusType.STRENGTH, upgraded ? 4 : 2);
      PlayerState.get().addStatus(StatusType.STRENGTH_DOWN, upgraded ? 4 : 2);
      BattleState.get().endTurnActions.push(() => {
        PlayerState.get().removeStatus(StatusType.STRENGTH, upgraded ? 4 : 2);
      });
    },
    type: CardType.SKILL,
    effect: CardEffectType.SELF,
    description: ({ upgraded = false }: { upgraded: boolean }) =>
      `Gain ${upgraded ? 4 : 2} Strength.\nAt the end of this turn,\nlose ${
        upgraded ? 4 : 2
      } Strength.`,
    audio: [heavyAtk], //TODO: sound effect
  },
  Havoc: {
    name: "Havoc",
    rarity: CardRarity.COMMON,
    upgraded: false,
    manaCost: () => 1,
    image: getImage({ sheetNumber: 2, position: [2, 10] }),
    specialEffect: () => {
      const battle = BattleState.get();
      if (battle.drawPile.length + battle.discardPile.length >= 1) {
        const nextCard = battle.draw(1);
        battle.resolveCardEffect(nextCard[0]);
        battle.exhaustCards(nextCard);
      }
    },
    type: CardType.SKILL,
    effect: CardEffectType.SELF,
    description: () => `Play the top card of\nyour draw pile and\nExhaust it.`,
    audio: [heavyAtk], //TODO: sound effect
  },
  Headbutt: {
    name: "Headbutt",
    rarity: CardRarity.COMMON,
    upgraded: false,
    manaCost: () => 1,
    damage: ({ upgraded }: IEvaluatedCardProperty) => (upgraded ? 12 : 9),
    cardSelection: () => ({
      amount: 1,
      from: () => {
        return BattleState.get().discardPile;
      },
      selectCards: (cards: CardState[]) => {
        if (cards.length > 1) {
          throw new Error("Headbutt can only select 1 card!");
        }
        BattleState.get().moveCards({
          cards,
          from: PileOfCards.DISCARD,
          to: PileOfCards.DRAW,
        });
        BattleState.get().callNextAction();
      },
    }),
    image: getImage({ sheetNumber: 1, position: [0, 9] }),
    type: CardType.ATTACK,
    effect: CardEffectType.SPECIFIC_ENEMY,
    description: (props: IEvaluatedCardProperty) =>
      `Deal ${singleTargetDamage(
        props.damage ?? 0,
        props.selected
      )} damage.\nPut a card from your\ndiscard pile on top of\nyour draw pile.`,
    audio: [heavyAtk], //TODO: sound effect
  },
  "Heavy Blade": {
    name: "Heavy Blade",
    rarity: CardRarity.COMMON,
    upgraded: false,
    manaCost: () => 2,
    image: getImage({ sheetNumber: 4, position: [3, 5] }),
    damage: ({ upgraded, includeStatuses }: IEvaluatedCardProperty) => {
      return (
        14 +
        (upgraded ? 5 : 3) * (includeStatuses ? PlayerState.get().strength : 0)
      );
    },
    type: CardType.ATTACK,
    effect: CardEffectType.SPECIFIC_ENEMY,
    description: (props: IEvaluatedCardProperty) =>
      `Deal ${singleTargetDamage(
        props.damage ?? 0,
        props.selected
      )} damage.\nStrength affects this\n card ${
        props.upgraded ? 5 : 3
      } times.`,
    audio: [heavyAtk], //TODO: sound effect
  },
  "Iron Wave": {
    name: "Iron Wave",
    rarity: CardRarity.COMMON,
    upgraded: false,
    manaCost: () => 1,
    image: getImage({ sheetNumber: 4, position: [4, 8] }),
    block: (props: IEvaluatedCardProperty) => (props.upgraded ? 7 : 5),
    damage: (props: IEvaluatedCardProperty) => (props.upgraded ? 7 : 5),
    type: CardType.ATTACK,
    effect: CardEffectType.SPECIFIC_ENEMY,
    description: (props: IEvaluatedCardProperty) =>
      `Gain ${props.block} Block.\nDeal ${singleTargetDamage(
        props.damage ?? 0,
        props.selected
      )} damage.`,
    audio: [addBlock, fastAtk],
  },
  "Perfected Strike": {
    name: "Perfected Strike",
    rarity: CardRarity.COMMON,
    upgraded: false,
    manaCost: () => 1,
    image: getImage({ sheetNumber: 5, position: [2, 3] }),
    damage: ({ upgraded, includeStatuses }: IEvaluatedCardProperty) => {
      return (
        6 +
        PlayerState.get().deck.filter((card) =>
          card.name.toLowerCase().includes("strike")
        ).length *
          (upgraded ? 3 : 2) +
        (includeStatuses ? PlayerState.get().strength : 0)
      );
    },
    type: CardType.ATTACK,
    effect: CardEffectType.SPECIFIC_ENEMY,
    description: (props: IEvaluatedCardProperty) =>
      `Deal ${singleTargetDamage(
        props.damage ?? 0,
        props.selected
      )} damage.\n Deals an additional\n${
        props.upgraded ? 3 : 2
      } damage for ALL of your\ncards containing\n"Strike".`,
    audio: [heavyAtk], //TODO: sound effect
  },
  "Pommel Strike": {
    name: "Pommel Strike",
    rarity: CardRarity.COMMON,
    upgraded: false,
    manaCost: () => 1,
    image: getImage({ sheetNumber: 5, position: [0, 0] }),
    damage: ({ upgraded }: IEvaluatedCardProperty) =>
      upgraded ? 10 : 9,
    specialEffect: (upgraded = false) => {
      BattleState.get().draw(upgraded ? 2 : 1);
    },
    type: CardType.ATTACK,
    effect: CardEffectType.SPECIFIC_ENEMY,
    description: (props: IEvaluatedCardProperty) =>
      `Deal ${singleTargetDamage(
        props.damage ?? 0,
        props.selected
      )} damage.\nDraw ${props.upgraded ? 2 : 1} card.`,
    audio: [heavyAtk], //TODO: sound effect
  },
  "Shrug It Off": {
    name: "Shrug It Off",
    rarity: CardRarity.COMMON,
    upgraded: false,
    manaCost: () => 1,
    image: getImage({ sheetNumber: 2, position: [3, 2] }),
    block: ({ upgraded }: IEvaluatedCardProperty) =>
      upgraded ? 11 : 8,
    specialEffect: () => BattleState.get().draw(1),
    type: CardType.SKILL,
    effect: CardEffectType.SELF,
    description: (props: IEvaluatedCardProperty) =>
      `Gain ${props.block} Block.\nDraw 1 card.`,
    audio: addBlock,
  },
  "Sword Boomerang": {
    name: "Sword Boomerang",
    rarity: CardRarity.COMMON,
    upgraded: false,
    manaCost: () => 1,
    image: getImage({ sheetNumber: 5, position: [3, 0] }),
    damageInstances: (upgraded = false) => (upgraded ? 4 : 3),
    damage: () => 3,
    type: CardType.ATTACK,
    effect: CardEffectType.RANDOM,
    description: (props: IEvaluatedCardProperty) =>
      `Deal ${props.damage} damage to a\nrandom enemy ${cardMap[
        "Sword Boomerang"
      ].damageInstances?.(props.upgraded)} times.`,
    audio: [fastAtk],
  },
  Thunderclap: {
    name: "Thunderclap",
    rarity: CardRarity.COMMON,
    upgraded: false,
    manaCost: () => 1,
    image: getImage({ sheetNumber: 5, position: [4, 1] }),
    damage: ({ upgraded }: IEvaluatedCardProperty) => (upgraded ? 7 : 4),
    status: () => ({
      type: StatusType.VULNERABLE,
      target: CardEffectType.ALL_ENEMIES,
      amount: 1,
      degrades: true,
    }),
    type: CardType.ATTACK,
    effect: CardEffectType.ALL_ENEMIES,
    description: (props: IEvaluatedCardProperty) =>
      `Deal ${singleTargetDamage(
        props.damage ?? 0,
        props.selected
      )} damage and\napply 1 Vulnerable to\nALL enemies.`,
    audio: [heavyAtk], //TODO: sound effect
  },
};

export const nonBasicCardList = Object.values(cardMap).filter(
  (card) => card.rarity !== CardRarity.STARTER
);

export const cardsByRarity = groupBy(nonBasicCardList, (card) => card.rarity);
interface IChanceByRarity {
  [index: string]: number;
}

// 60% common, 37% uncommon 3% rare
const chanceByRarity: IChanceByRarity = {
  [CardRarity.COMMON]: 60,
  [CardRarity.UNCOMMON]: 37,
  [CardRarity.RARE]: 3,
};

export const rarityChance = Object.keys(cardsByRarity).map(
  (rarity) => chanceByRarity[rarity]
);
