import cards1 from "../../Images/cards1.jpg";
import cards2 from "../../Images/cards2.jpg";
import cards3 from "../../Images/cards3.jpg";
import cards4 from "../../Images/cards4.jpg";
import cards5 from "../../Images/cards5.jpg";
import { Card, CardEffectType, CardRarity, CardType, ICard } from "./Card";
import { StatusType } from "../Common/StatusBar";
// @ts-ignore
import fastAtk from "../../Audio/fastAtk.ogg";
// @ts-ignore
import heavyAtk from "../../Audio/heavyAtk.ogg";
// @ts-ignore
import addBlock from "../../Audio/addBlock.ogg";
import { Battle, IBattleState, PileOfCards } from "../Battle/Battle";
import { groupBy, range } from "lodash";
import { Player } from "../Entities/Player/Player";
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
    manaCost: () => 2,
    damage: (upgraded = _this.bash.upgraded) =>
      upgraded ? 10 : 8 + Player.get().extradamage,
    upgraded: false,
    status: (upgraded = _this.bash.upgraded) => ({
      type: StatusType.vulnerable,
      target: CardEffectType.SpecificEnemy,
      amount: upgraded ? 3 : 2,
      degrades: true,
    }),
    image: getImage({ sheetNumber: 3, position: [7, 3] }),
    type: CardType.Attack,
    effect: CardEffectType.SpecificEnemy,
    description: (upgraded = _this.bash.upgraded) =>
      `Deal ${_this.bash.damage?.(upgraded)} damage.\nApply ${
        _this.bash.status?.().amount
      } vulnerable.`,
    audio: [heavyAtk],
  },
  defend: {
    name: "Defend",
    rarity: CardRarity.starter,
    manaCost: () => 1,
    upgraded: false,
    block: (upgraded = _this.defend.upgraded) =>
      upgraded ? 8 : 5 + Player.get().extradamage,
    image: getImage({ sheetNumber: 1, position: [6, 4] }),
    type: CardType.Skill,
    effect: CardEffectType.Self,
    description: (upgraded = _this.defend.upgraded) =>
      `Gain ${_this.defend.block?.(upgraded)} Block.`,
    audio: [addBlock],
  },
  strike: {
    name: "Strike",
    rarity: CardRarity.starter,
    upgraded: false,
    manaCost: () => 1,
    damage: (upgraded = _this.strike.upgraded) =>
      upgraded ? 9 : 6 + Player.get().extradamage,
    image: getImage({ sheetNumber: 5, position: [4, 2] }),
    type: CardType.Attack,
    effect: CardEffectType.SpecificEnemy,
    description: (upgraded = _this.strike.upgraded) =>
      `Deal ${_this.strike.damage?.(upgraded)} damage.`,
    audio: [fastAtk],
  },
  anger: {
    name: "Anger",
    rarity: CardRarity.common,
    upgraded: false,
    manaCost: () => 0,
    damage: (upgraded = _this.anger.upgraded) =>
      upgraded ? 8 : 6 + Player.get().extradamage,
    image: getImage({ sheetNumber: 3, position: [4, 3] }),
    specialEffect: () => {
      let battle = Battle.get();
      if (!battle.discardPile) {
        return;
      }
      battle.discardPile = [...battle.discardPile, new Card(cardMap.anger)];
    },
    type: CardType.Attack,
    effect: CardEffectType.SpecificEnemy,
    description: (upgraded = _this.anger.upgraded) =>
      `Deal ${_this.anger.damage?.(
        upgraded
      )} damage.\nAdd a copy of this card\ninto your discard pile.`,
    audio: [heavyAtk], //TODO: sound effect
  },
  // armament: {
  //   name: "Armament",
  //   rarity: CardRarity.common,
  //   manaCost: 1,
  //   block: () => 5 + Player.get().extradamage,
  //   cardSelection: () => {
  //     let battle = Battle.get();
  //     return battle.currentHand.filter(card => card.get.id !== battle.selectedCardId;)
  //   },
  //   cardSelectionEffect:() => {
  //     //UPGRADE;
  //   }
  //   image: getImage({ sheetNumber: 1, position: [0, 9] }),
  //   type: CardType.Skill,
  //   effect: CardEffectType.Self,
  //   description: `Gain {} Block.\nUpgrade a card in your\nhand for the rest of the combat.`,
  //   descriptionVariables: ["block"],
  //   targetSpecificEnemy: true,
  //   audio: [heavyAtk], //TODO: sound effect
  // },
  bodySlam: {
    name: "Body Slam",
    rarity: CardRarity.common,
    upgraded: false,
    manaCost: (upgraded = _this.bodySlam.upgraded) => (upgraded ? 0 : 1),
    damage: () => {
      return Player.get().block + Player.get().extradamage;
    },
    image: getImage({ sheetNumber: 3, position: [5, 2] }),
    type: CardType.Attack,
    effect: CardEffectType.SpecificEnemy,
    description: () => `Deal damage equal to\nyour block`,
    audio: [heavyAtk], //TODO: sound effect
  },
  clash: {
    name: "Clash",
    rarity: CardRarity.common,
    manaCost: () => 0,
    upgraded: false,
    damage: (upgraded = _this.clash.upgraded) =>
      upgraded ? 18 : 14 + Player.get().damage,
    prerequisite: (battleState: IBattleState) => {
      return battleState.currentHand.every(
        (card) => card.get.type === CardType.Attack
      );
    },
    image: getImage({ sheetNumber: 3, position: [4, 1] }),
    type: CardType.Attack,
    effect: CardEffectType.SpecificEnemy,
    description: (upgraded = _this.clash.upgraded) =>
      `Can only be played if\nevery card in your\nhand is an Attack.\nDeal ${_this.clash.damage?.(
        upgraded
      )} damage.`,
    audio: [heavyAtk], //TODO: sound effect
  },
  cleave: {
    name: "Cleave",
    rarity: CardRarity.common,
    upgraded: false,
    manaCost: () => 1,
    damage: (upgraded = _this.cleave.upgraded) =>
      upgraded ? 11 : 8 + Player.get().damage,
    image: getImage({ sheetNumber: 3, position: [6, 1] }),
    type: CardType.Attack,
    effect: CardEffectType.AllEnemies,
    description: (upgraded = _this.cleave.upgraded) =>
      `Deal ${_this.cleave.damage?.(upgraded)} damage to ALL\n enemies.`,
    audio: [heavyAtk], //TODO: sound effect
  },
  clothesline: {
    name: "Clothesline",
    rarity: CardRarity.common,
    upgraded: false,
    manaCost: () => 2,
    damage: (upgraded = _this.clothesline.upgraded) =>
      upgraded ? 14 : 12 + Player.get().damage,
    status: (upgraded = _this.clothesline.upgraded) => ({
      type: StatusType.weak,
      target: CardEffectType.SpecificEnemy,
      amount: upgraded ? 3 : 2,
      degrades: true,
    }),
    image: getImage({ sheetNumber: 3, position: [7, 1] }),
    type: CardType.Attack,
    effect: CardEffectType.SpecificEnemy,
    description: (upgraded = _this.clothesline.upgraded) =>
      `Deal ${_this.clothesline.damage?.(upgraded)} damage.\nApply ${
        _this.clothesline.status?.(upgraded).amount
      } Weak.`,
    audio: [heavyAtk], //TODO: sound effect
  },
  flex: {
    name: "Flex",
    rarity: CardRarity.common,
    upgraded: false,
    manaCost: () => 0,
    image: getImage({ sheetNumber: 1, position: [0, 0] }),
    specialEffect: (upgraded = _this.flex.upgraded) => {
      let battle = Battle.get();
      Player.get().addStatus(StatusType.strength, upgraded ? 4 : 2);
      battle.endTurnActions.push(() => {
        Player.get().removeStatus(StatusType.strength, upgraded ? 4 : 2);
      });
    },
    type: CardType.Skill,
    effect: CardEffectType.Self,
    description: (upgraded = _this.flex.upgraded) =>
      `Gain ${upgraded ? 4 : 2} Strength.\nAt the end of this turn,\nlose ${
        upgraded ? 4 : 2
      } Strength.`,
    audio: [heavyAtk], //TODO: sound effect
  },
  havoc: {
    name: "Havoc",
    rarity: CardRarity.common,
    upgraded: false,
    manaCost: () => 1,
    image: getImage({ sheetNumber: 2, position: [2, 10] }),
    specialEffect: () => {
      let battle = Battle.get();
      if (battle.drawPile.length + battle.discardPile.length >= 1) {
        let nextCard = battle.draw(1);
        battle.resolveCardEffect(nextCard[0]);
        battle.exhaustCards(nextCard);
      }
    },
    type: CardType.Skill,
    effect: CardEffectType.Self,
    description: () => `Play the top card of\nyour draw pile and\nExhaust it.`,
    audio: [heavyAtk], //TODO: sound effect
  },
  headbutt: {
    name: "Headbutt",
    rarity: CardRarity.common,
    upgraded: false,
    manaCost: () => 1,
    damage: (upgraded = _this.headbutt.upgraded) =>
      upgraded ? 12 : 9 + Player.get().damage,
    cardSelection: {
      amount: 1,
      from: () => {
        return Battle.get().discardPile;
      },
      selectCards: (cards: Card[]) => {
        if (cards.length > 1) {
          throw new Error("Headbutt can only select 1 card!");
        }
        Battle.get().moveCards({
          cards,
          from: PileOfCards.discard,
          to: PileOfCards.draw,
        });
        Battle.get().callNextAction();
      },
    },
    image: getImage({ sheetNumber: 1, position: [0, 9] }),
    type: CardType.Attack,
    effect: CardEffectType.SpecificEnemy,
    description: (upgraded = _this.headbutt.upgraded) =>
      `Deal ${_this.headbutt.damage?.(
        upgraded
      )} damage.\nPut a card from your\ndiscard pile on top of\nyour draw pile.`,
    audio: [heavyAtk], //TODO: sound effect
  },
  heavyBlade: {
    name: "Heavy Blade",
    rarity: CardRarity.common,
    upgraded: false,
    manaCost: () => 2,
    image: getImage({ sheetNumber: 4, position: [3, 5] }),
    damage: (upgraded = _this.heavyBlade.upgraded) => {
      return 14 + (upgraded ? 5 : 3 * Player.get().extradamage);
    },
    type: CardType.Attack,
    effect: CardEffectType.SpecificEnemy,
    description: (upgraded = _this.heavyBlade.upgraded) =>
      `Deal ${_this.heavyBlade.damage?.(
        upgraded
      )} damage.\nStrength affects this\n card ${upgraded ? 5 : 3} times.`,
    audio: [heavyAtk], //TODO: sound effect
  },
  ironWave: {
    name: "Iron Wave",
    rarity: CardRarity.common,
    upgraded: false,
    manaCost: () => 1,
    image: getImage({ sheetNumber: 4, position: [4, 8] }),
    block: (upgraded = _this.ironWave.upgraded) =>
      upgraded ? 7 : 5 + Player.get().extrablock,
    specialEffect: (upgraded = _this.ironWave.upgraded) => {
      let battle = Battle.get();
      if (!battle.selectedMonsters)
        throw new Error("Iron Wave needs a selected monster!");

      battle.selectedMonsters[0].takeDamage(
        battle.calculateDamage({
          damage: upgraded ? 7 : 5 + Player.get().extradamage,
          statuses: battle.selectedMonsters[0].get.statuses,
        })
      );
    },
    type: CardType.Attack,
    effect: CardEffectType.SpecificEnemy,
    description: (upgraded = _this.ironWave.upgraded) =>
      `Gain ${_this.ironWave.block?.()} Block.\nDeal ${
        upgraded ? 7 : 5 + Player.get().extradamage
      } damage.`,
    audio: [addBlock, fastAtk],
  },
  perfectedStrike: {
    name: "Perfected Strike",
    rarity: CardRarity.common,
    upgraded: false,
    manaCost: () => 1,
    image: getImage({ sheetNumber: 5, position: [2, 3] }),
    damage: (upgraded = _this.perfectedStrike.upgraded) => {
      return (
        6 +
        Player.get().get.deck.filter((card) =>
          card.get.name.toLowerCase().includes("strike")
        ).length *
          (upgraded ? 3 : 2)
      );
    },
    type: CardType.Attack,
    effect: CardEffectType.SpecificEnemy,
    description: (upgraded = _this.perfectedStrike.upgraded) =>
      `Deal ${_this.perfectedStrike.damage?.(
        upgraded
      )} damage.\n Deals an additional\n${
        upgraded ? 3 : 2
      } damage for ALL of your\ncards containing\n"Strike".`,
    audio: [heavyAtk], //TODO: sound effect
  },
  pommelStrike: {
    name: "Pommel Strike",
    rarity: CardRarity.common,
    upgraded: false,
    manaCost: () => 1,
    image: getImage({ sheetNumber: 5, position: [0, 0] }),
    damage: (upgraded = _this.pommelStrike.upgraded) =>
      upgraded ? 10 : 9 + Player.get().extradamage,
    specialEffect: (upgraded = _this.pommelStrike.upgraded) => {
      Battle.get().draw(upgraded ? 2 : 1);
    },
    type: CardType.Attack,
    effect: CardEffectType.SpecificEnemy,
    description: (upgraded = _this.pommelStrike.upgraded) =>
      `Deal ${_this.pommelStrike.damage?.(upgraded)} damage.\nDraw ${
        upgraded ? 2 : 1
      } card.`,
    audio: [heavyAtk], //TODO: sound effect
  },
  shrugItOff: {
    name: "Shrug It Off",
    rarity: CardRarity.common,
    upgraded: false,
    manaCost: () => 1,
    image: getImage({ sheetNumber: 2, position: [3, 2] }),
    block: (upgraded = _this.shrugItOff.upgraded) =>
      upgraded ? 11 : 8 + Player.get().extrablock,
    specialEffect: () => Battle.get().draw(1),
    type: CardType.Skill,
    effect: CardEffectType.Self,
    description: (upgraded = _this.shrugItOff.upgraded) =>
      `Gain ${_this.shrugItOff.block?.(upgraded)} Block.\nDraw 1 card.`,
    audio: addBlock,
  },
  swordBoomerang: {
    name: "Sword Boomerang",
    rarity: CardRarity.common,
    upgraded: false,
    manaCost: () => 1,
    image: getImage({ sheetNumber: 5, position: [3, 0] }),
    damageInstances: (upgraded = _this.swordBoomerang.upgraded) =>
      upgraded ? 4 : 3,
    damage: () => 3 + Player.get().extradamage,
    type: CardType.Attack,
    effect: CardEffectType.Random,
    description: (upgraded = _this.swordBoomerang.upgraded) =>
      `Deal ${_this.swordBoomerang.damage?.()} damage to a\nrandom enemy ${_this.swordBoomerang.damageInstances?.(
        upgraded
      )} times.`,
    audio: [fastAtk],
  },
  thunderclap: {
    name: "Thunderclap",
    rarity: CardRarity.common,
    upgraded: false,
    manaCost: () => 1,
    image: getImage({ sheetNumber: 5, position: [4, 1] }),
    damage: (upgraded = _this.thunderclap.upgraded) =>
      upgraded ? 7 : 4 + Player.get().extradamage,
    status: () => ({
      type: StatusType.vulnerable,
      target: CardEffectType.AllEnemies,
      amount: 1,
      degrades: true,
    }),
    type: CardType.Attack,
    effect: CardEffectType.AllEnemies,
    description: (upgraded = _this.thunderclap.upgraded) =>
      `Deal ${_this.thunderclap.damage?.(
        upgraded
      )} damage and\napply 1 Vulnerable to\nALL enemies.`,
    audio: [heavyAtk], //TODO: sound effect
  },
};

const _this = cardMap;

export const nonBasicCardList = Object.values(cardMap).filter(
  (card) => card.rarity !== CardRarity.starter
);

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
