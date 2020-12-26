import cards1 from "../../Images/cards1.png";
import cards2 from "../../Images/cards2.png";
import cards3 from "../../Images/cards3.png";
import cards4 from "../../Images/cards4.png";
import cards5 from "../../Images/cards5.png";
import { Card, CardEffectType, CardRarity, CardType, ICard } from "./Card";
import { StatusType } from "../Common/StatusBar";
// @ts-ignore
import fastAtk from "../../Audio/fastAtk.ogg";
// @ts-ignore
import heavyAtk from "../../Audio/heavyAtk.ogg";
// @ts-ignore
import addBlock from "../../Audio/addBlock.ogg";
import { Battle, IBattleState } from "../Battle/Battle";
import { groupBy } from "lodash";
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
  let src = "cards" + sheetNumber;
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

export const cardMap: ICardMap = {
  bash: {
    name: "Bash",
    rarity: CardRarity.starter,
    manaCost: 2,
    damage: 8,
    status: {
      type: StatusType.vulnerable,
      amount: 2,
      degrades: true,
    },
    image: getImage({ sheetNumber: 3, position: [7, 3] }),
    type: CardType.Attack,
    effect: CardEffectType.SpecificEnemy,
    description: `Deal {} damage.\nApply 2 vulnerable.`,
    descriptionVariables: ["damage"],
    targetSpecificEnemy: true,
    audio: heavyAtk,
  },
  defend: {
    name: "Defend",
    rarity: CardRarity.starter,
    manaCost: 1,
    block: 5,
    image: getImage({ sheetNumber: 1, position: [6, 4] }),
    type: CardType.Skill,
    effect: CardEffectType.Self,
    description: "Gain {} Block.",
    descriptionVariables: ["block"],
    targetSpecificEnemy: false,
    audio: addBlock,
  },
  strike: {
    name: "Strike",
    rarity: CardRarity.starter,
    manaCost: 1,
    damage: 999,
    image: getImage({ sheetNumber: 5, position: [4, 2] }),
    type: CardType.Attack,
    effect: CardEffectType.SpecificEnemy,
    description: `Deal {} damage.`,
    descriptionVariables: ["damage"],
    targetSpecificEnemy: true,
    audio: fastAtk,
  },
  anger: {
    name: "Anger",
    rarity: CardRarity.common,
    manaCost: 0,
    damage: 6,
    image: getImage({ sheetNumber: 3, position: [4, 3] }),
    special: () => {
      let battle = new Battle();
      if (!battle.discardPile) {
        return;
      }

      //TODO: need to update when implementing card upgrading
      battle.discardPile = [
        ...battle.discardPile,
        new Card(cardMap.anger),
      ];
    },
    type: CardType.Attack,
    effect: CardEffectType.SpecificEnemy,
    description: `Deal {} damage.\nAdd a copy of this card\ninto your discard pile.`,
    descriptionVariables: ["damage"],
    targetSpecificEnemy: true,
    audio: heavyAtk, //TODO: sound effect
  },
  //TODO Armament requires UPGRADE functionality
  bodySlam: {
    name: "Body Slam",
    rarity: CardRarity.common,
    manaCost: 1,
    damage: () => {
      let battle = new Battle();
      return battle.player.block;
    },
    image: getImage({ sheetNumber: 3, position: [5, 2] }),
    type: CardType.Attack,
    effect: CardEffectType.SpecificEnemy,
    description: `Deal damage equal to\nyour block`,
    descriptionVariables: [],
    targetSpecificEnemy: true,
    audio: heavyAtk, //TODO: sound effect
  },
  clash: {
    name: "Clash",
    rarity: CardRarity.common,
    manaCost: 0,
    damage: 14,
    prerequisite: (battleState: IBattleState) => {
      return battleState.currentHand.every(
        (card) => card.get.type === CardType.Attack
      );
    },
    image: getImage({ sheetNumber: 3, position: [4, 1] }),
    type: CardType.Attack,
    effect: CardEffectType.SpecificEnemy,
    description: `Can only be played if\nevery card in your\nhand is an Attack.\nDeal {} damage.`,
    descriptionVariables: ["damage"],
    targetSpecificEnemy: true,
    audio: heavyAtk, //TODO: sound effect
  },
  cleave: {
    name: "Cleave",
    rarity: CardRarity.common,
    manaCost: 1,
    damage: 8,
    image: getImage({ sheetNumber: 3, position: [6, 1] }),
    type: CardType.Attack,
    effect: CardEffectType.AllEnemies,
    description: `Deal 8 damage to ALL\n enemies.`,
    descriptionVariables: ["damage"],
    targetSpecificEnemy: true,
    audio: heavyAtk, //TODO: sound effect
  },
  clothesline: {
    name: "Clothesline",
    rarity: CardRarity.common,
    manaCost: 2,
    damage: 12,
    status: {
      type: StatusType.weak,
      amount: 2,
      degrades: true,
    },
    image: getImage({ sheetNumber: 3, position: [7, 1] }),
    type: CardType.Attack,
    effect: CardEffectType.SpecificEnemy,
    description: `Deal {} damage.\nApply 2 Weak.`, //TODO: add weak to descriptionvariable
    descriptionVariables: ["damage"],
    targetSpecificEnemy: true,
    audio: heavyAtk, //TODO: sound effect
  },
  flex: {
    name: "Flex",
    rarity: CardRarity.common,
    manaCost: 0,
    image: getImage({ sheetNumber: 1, position: [0, 0] }),
    special: () => {
      let battle = new Battle();
      battle.player.addStatus(StatusType.strength, 2);
      battle.endTurnActions.push(() => {
        new Battle().player.removeStatus(StatusType.strength, 2);
      });
    },
    type: CardType.Skill,
    effect: CardEffectType.Self,
    description: `Gain 2 Strength.\nAt the end of this turn,\nlose 2 Strength.`,
    targetSpecificEnemy: false,
    audio: heavyAtk, //TODO: sound effect
  },
  havoc: {
    name: "Havoc",
    rarity: CardRarity.common,
    manaCost: 1,
    image: getImage({ sheetNumber: 2, position: [2, 10] }),
    special: () => {
      let battle = new Battle();
      if (battle.drawPile.length + battle.discardPile.length >= 1) {
        let nextCard = battle.draw(1);
        battle.resolveTargetedCard(nextCard);
        battle.exhaustCards(nextCard);
      }
    },
    type: CardType.Skill,
    effect: CardEffectType.Self,
    description: `Play the top card of\nyour draw pile and\nExhaust it.`,
    targetSpecificEnemy: false,
    audio: heavyAtk, //TODO: sound effect
  },
  //TODO: Headbutt needs card selection
  heavyBlade: {
    name: "Heavy Blade",
    rarity: CardRarity.common,
    manaCost: 2,
    image: getImage({ sheetNumber: 4, position: [3, 5] }),
    damage: () => {
      let battle = new Battle();
      return 14 + 2 * battle.player.extradamage; //it's 2x extra here because extradamage itself is added elsewhere
    },
    type: CardType.Attack,
    effect: CardEffectType.SpecificEnemy,
    description: `Deal {} damage.\nStrength affects this\n card 3 times.`,
    descriptionVariables: ["damage"],
    targetSpecificEnemy: true,
    audio: heavyAtk, //TODO: sound effect
  },
  ironWave: {
    name: "Iron Wave",
    rarity: CardRarity.common,
    manaCost: 1,
    image: getImage({ sheetNumber: 4, position: [4, 8] }),
    block: 5,
    special: () => {
      let battle = new Battle();
      if (!battle.selectedMonster)
        throw new Error("Iron Wave needs a selected monster!");

      battle.selectedMonster.takeDamage(
        battle.calculateDamage({
          damage: 5,
          extradamage: battle.player.extradamage,
          statuses: battle.selectedMonster.get.statuses,
        })
      );
    },
    type: CardType.Attack,
    effect: CardEffectType.SpecificEnemy,
    description: `Gain {} Block.\nDeal 5 damage.`,
    descriptionVariables: ["block"],
    targetSpecificEnemy: true,
    audio: heavyAtk, //TODO: sound effect
  },
  perfectedStrike: {
    name: "Perfected Strike",
    rarity: CardRarity.common,
    manaCost: 1,
    image: getImage({ sheetNumber: 5, position: [2, 3] }),
    damage: () => {
      let battle = new Battle();
      return (
        6 +
        battle.player.get.deck.filter((card) =>
          card.get.name.toLowerCase().includes("strike")
        ).length *
        2
      );
    },
    type: CardType.Attack,
    effect: CardEffectType.SpecificEnemy,
    description: `Deal {} damage.\n Deals an additional\n2 damage for ALL of your\ncards containing\n"Strike".`,
    descriptionVariables: ["damage"],
    targetSpecificEnemy: true,
    audio: heavyAtk, //TODO: sound effect
  },
  pommelStrike: {
    name: "Pommel Strike",
    rarity: CardRarity.common,
    manaCost: 1,
    image: getImage({ sheetNumber: 5, position: [0, 0] }),
    damage: 9,
    special: () => {
      let battle = new Battle();
      battle.draw(1);
    },
    type: CardType.Attack,
    effect: CardEffectType.SpecificEnemy,
    description: `Deal {} damage.\nDraw 1 card.`,
    descriptionVariables: ["damage"],
    targetSpecificEnemy: true,
    audio: heavyAtk, //TODO: sound effect
  },
  shrugItOff: {
    name: "Shrug It Off",
    rarity: CardRarity.common,
    manaCost: 1,
    image: getImage({ sheetNumber: 2, position: [3, 2] }),
    block: 8,
    special: () => {
      let battle = new Battle();
      battle.draw(1);
    },
    type: CardType.Skill,
    effect: CardEffectType.Self,
    description: `Gain 8 Block.\nDraw 1 card.`,
    targetSpecificEnemy: false,
    audio: heavyAtk, //TODO: sound effect
  },
  swordBoomerang: {
    name: "Sword Boomerang",
    rarity: CardRarity.common,
    manaCost: 1,
    image: getImage({ sheetNumber: 5, position: [3, 0] }),
    damageInstances: 3,
    damage: 3,
    type: CardType.Attack,
    effect: CardEffectType.Random,
    description: `Deal 3 damage to a\nrandom enemy 3 times.`,
    targetSpecificEnemy: false,
    audio: heavyAtk, //TODO: sound effect
  },
  thunderclap: {
    name: "Thunderclap",
    rarity: CardRarity.common,
    manaCost: 1,
    image: getImage({ sheetNumber: 5, position: [4, 1] }),
    damage: 4,
    special: () => {
      let battle = new Battle();
      battle.monsters?.forEach((monster) =>
        monster.addStatus(StatusType.vulnerable)
      );
    },
    type: CardType.Attack,
    effect: CardEffectType.AllEnemies,
    description: `Deal {} damage and\napply 1 Vulnerable to\nALL enemies.`,
    descriptionVariables: ["damage"],
    targetSpecificEnemy: true,
    audio: heavyAtk, //TODO: sound effect
  },
};

export const nonBasicCardList = Object.values(cardMap).filter(card => card.rarity !== CardRarity.starter);

export const cardsByRarity = groupBy(nonBasicCardList, (card) => card.rarity);
interface IChanceByRarity {
  [index: string]: number;
}

// 60% common, 37% uncommon 3% rare
const chanceByRarity: IChanceByRarity = {
  [CardRarity.common]: 60,
  [CardRarity.uncommon]: 37,
  [CardRarity.rare]: 3,
};

export const rarityChance = Object.keys(cardsByRarity).map(
  (rarity) => chanceByRarity[rarity]
);