import cards1 from "../../Images/cards1.png";
import cards2 from "../../Images/cards2.png";
import cards3 from "../../Images/cards3.png";
import cards4 from "../../Images/cards4.png";
import cards5 from "../../Images/cards5.png";
import { Card, CardEffectType, CardRarity, CardType } from "./Card";
import { StatusType } from "../Common/StatusBar";
// @ts-ignore
import fastAtk from "../../Audio/fastAtk.ogg";
// @ts-ignore
import heavyAtk from "../../Audio/heavyAtk.ogg";
// @ts-ignore
import addBlock from "../../Audio/addBlock.ogg";
import { Battle, IBattleState } from "../Battle/Battle";
import { random, range, uniqueId } from "lodash";

interface ISpriteToCardSize {
  [index: string]: { CARD_WIDTH: number, CARD_HEIGHT: number }
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

const getImage = ({ sheetNumber, position }: { sheetNumber: number, position: [number, number] }) => {
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

  return { src: path, position, width: spriteToCardSize[src].CARD_WIDTH, height: spriteToCardSize[src].CARD_HEIGHT };
};

const Bash = (id: string) =>
  new Card({
    id,
    name: "Bash",
    rarity: CardRarity.common,
    manaCost: 2,
    damage: 8,
    status: {
      type: StatusType.vulnerable,
      amount: 2,
      degrades: true,
    },
    image: getImage({ sheetNumber: 3, position: [7, 3] }),
    type: CardType.Attack,
    effect: CardEffectType.SingleTarget,
    description: `Deal {} damage.\nApply 2 vulnerable.`,
    descriptionVariables: ["damage"],
    targetEnemy: true,
    audio: heavyAtk,
  });

const Defend = (id: string) =>
  new Card({
    id,
    name: "Defend",
    rarity: CardRarity.common,
    manaCost: 1,
    block: 5,
    image: getImage({ sheetNumber: 1, position: [6, 4] }),
    type: CardType.Skill,
    effect: CardEffectType.AddBlock,
    description: "Gain {} Block.",
    descriptionVariables: ["block"],
    targetEnemy: false,
    audio: addBlock,
  });

const Strike = (id: string) =>
  new Card({
    id,
    name: "Strike",
    rarity: CardRarity.common,
    manaCost: 1,
    damage: 6,
    image: getImage({ sheetNumber: 5, position: [4, 2] }),
    type: CardType.Attack,
    effect: CardEffectType.SingleTarget,
    description: `Deal {} damage.`,
    descriptionVariables: ["damage"],
    targetEnemy: true,
    audio: fastAtk,
  });

const Anger = (id: string) =>
  new Card({
    id,
    name: "Anger",
    rarity: CardRarity.common,
    manaCost: 0,
    damage: 6,
    image: getImage({ sheetNumber: 3, position: [4, 3] }),
    special: (battleState: IBattleState) => {
      if (!battleState.discardPile) {
        return;
      }

      //TODO: need to update when implementing card upgrading
      battleState.discardPile = [...battleState.discardPile, cardMap.anger((uniqueId()))];
    },
    type: CardType.Attack,
    effect: CardEffectType.SingleTarget,
    description: `Deal {} damage.\nAdd a copy of this card to your discard pile.`,
    descriptionVariables: ["damage"],
    targetEnemy: true,
    audio: heavyAtk, //TODO: sound effect
  });

//TODO Armament requires UPGRADE functionality

const BodySlam = (id: string) =>
  new Card({
    id,
    name: "Body Slam",
    rarity: CardRarity.common,
    manaCost: 1,
    damage: () => {
      let battle = new Battle();
      return battle.player.block;
    },
    image: getImage({ sheetNumber: 3, position: [5, 2] }),
    type: CardType.Attack,
    effect: CardEffectType.SingleTarget,
    description: `Deal damage equal to your current block`,
    descriptionVariables: [],
    targetEnemy: true,
    audio: heavyAtk,//TODO: sound effect
  });

const Clash = (id: string) =>
  new Card({
    id,
    name: "Clash",
    rarity: CardRarity.common,
    manaCost: 0,
    damage: 14,
    prerequisite: (battleState: IBattleState) => {
      return battleState.currentHand.every(card => card.get.type === CardType.Attack);
    },
    image: getImage({ sheetNumber: 3, position: [4, 1] }),
    type: CardType.Attack,
    effect: CardEffectType.SingleTarget,
    description: `Can only be played if every card in your hand is an Attack.\nDeal {} damage.`,
    descriptionVariables: ["damage"],
    targetEnemy: true,
    audio: heavyAtk,//TODO: sound effect
  });

const Cleave = (id: string) =>
  new Card({
    id,
    name: "Cleave",
    rarity: CardRarity.common,
    manaCost: 1,
    damage: 8,
    image: getImage({ sheetNumber: 3, position: [6, 1] }),
    type: CardType.Attack,
    effect: CardEffectType.MultiTarget,
    description: `Deal 8 damage to ALL enemies.`,
    descriptionVariables: ["damage"],
    targetEnemy: true,
    audio: heavyAtk,//TODO: sound effect
  });

const Clothesline = (id: string) =>
  new Card({
    id,
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
    effect: CardEffectType.SingleTarget,
    description: `Deal {} damage. Apply 2 Weak.`, //TODO: add weak to descriptionvariable
    descriptionVariables: ["damage"],
    targetEnemy: true,
    audio: heavyAtk,//TODO: sound effect
  });

const Flex = (id: string) =>
  new Card({
    id,
    name: "Flex",
    rarity: CardRarity.common,
    manaCost: 0,
    image: getImage({ sheetNumber: 1, position: [0, 0] }),
    special: () => {
      let battle = new Battle();
      battle.player.addStatus(StatusType.strength, 2);
      battle.endTurnActions.push(() => {
        new Battle().player.removeStatus(StatusType.strength, 2);
      })
    },
    type: CardType.Skill,
    effect: CardEffectType.SingleTarget,
    description: `Gain 2 Strength. At the end of your turn, lose 2 Strength.`,
    targetEnemy: false,
    audio: heavyAtk,//TODO: sound effect
  });

const Havoc = (id: string) =>
  new Card({
    id,
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
    effect: CardEffectType.SingleTarget,
    description: `Play the top card of your draw pile and Exhaust it.`,
    targetEnemy: false,
    audio: heavyAtk,//TODO: sound effect
  });

//TODO: Headbutt needs card selection

const HeavyBlade = (id: string) =>
  new Card({
    id,
    name: "Heavy Blade",
    manaCost: 2,
    image: getImage({ sheetNumber: 4, position: [3, 5] }),
    damage: () => {
      let battle = new Battle();
      return 14 + (2 * battle.player.extradamage); //it's 2x extra here because extradamage itself is added elsewhere
    },
    type: CardType.Attack,
    effect: CardEffectType.SingleTarget,
    description: `Deal {} damage. Strength affects Heavy Blade 3 times.`,
    descriptionVariables: ["damage"],
    targetEnemy: true,
    audio: heavyAtk,//TODO: sound effect
  });

const IronWave = (id: string) =>
  new Card({
    id,
    name: "Iron Wave",
    manaCost: 1,
    image: getImage({ sheetNumber: 4, position: [4, 8] }),
    damage: 5,
    special: () => {
      let battle = new Battle();
      battle.player.addBlock(5);
    },
    type: CardType.Attack,
    effect: CardEffectType.SingleTarget,
    description: `Gain 5 Block. Deal {} damage.`,
    descriptionVariables: ["damage"],
    targetEnemy: true,
    audio: heavyAtk,//TODO: sound effect
  });

const PerfectedStrike = (id: string) =>
  new Card({
    id,
    name: "Perfected Strike",
    manaCost: 1,
    image: getImage({ sheetNumber: 5, position: [2, 3] }),
    damage: () => {
      let battle = new Battle();
      return 6 + (battle.player.get.deck.filter(card => card.get.name.toLowerCase().includes("strike")).length * 2);
    },
    type: CardType.Attack,
    effect: CardEffectType.SingleTarget,
    description: `Deal {} damage. Deals an additional 2 damage for ALL of your cards containing "Strike".`,
    descriptionVariables: ["damage"],
    targetEnemy: true,
    audio: heavyAtk,//TODO: sound effect
  });

const PommelStrike = (id: string) =>
  new Card({
    id,
    name: "Pommel Strike",
    manaCost: 1,
    image: getImage({ sheetNumber: 5, position: [0, 0] }),
    damage: 9,
    special: () => {
      let battle = new Battle();
      battle.draw(1);
    },
    type: CardType.Attack,
    effect: CardEffectType.SingleTarget,
    description: `Deal {} damage. Draw 1 card(s).`,
    descriptionVariables: ["damage"],
    targetEnemy: true,
    audio: heavyAtk,//TODO: sound effect
  });


const ShrugItOff = (id: string) =>
  new Card({
    id,
    name: "Shrug It Off",
    manaCost: 1,
    image: getImage({ sheetNumber: 2, position: [3, 2] }),
    damage: 0,
    special: () => {
      let battle = new Battle();
      battle.player.addBlock(8);
      battle.draw(1);
    },
    type: CardType.Skill,
    effect: CardEffectType.SingleTarget,
    description: `Gain 8 Block. Draw 1 card.`,
    targetEnemy: false,
    audio: heavyAtk,//TODO: sound effect
  });

const SwordBoomerang = (id: string) =>
  new Card({
    id,
    name: "Sword Boomerang",
    manaCost: 1,
    image: getImage({ sheetNumber: 5, position: [3, 0] }),
    damage: 0,
    special: () => {
      let battle = new Battle();
      range(0, 3).forEach(() => {
        let randomMonster = battle.monsters[random(0, battle.monsters.length - 1)];
        randomMonster.takeDamage(battle.calculateDamage({
          damage: 3,
          extradamage: battle.player.extradamage,
          statuses: randomMonster.get.statuses,
        }));
      });
    },
    type: CardType.Attack,
    effect: CardEffectType.SingleTarget,
    description: `Deal 3 damage to a random enemy 3 times.`,
    targetEnemy: true,
    audio: heavyAtk,//TODO: sound effect
  });

const Thunderclap = (id: string) =>
  new Card({
    id,
    name: "Thunderclap",
    manaCost: 1,
    image: getImage({ sheetNumber: 5, position: [4, 1] }),
    damage: 4,
    special: () => {
      let battle = new Battle();
      battle.monsters.forEach(monster => monster.addStatus(StatusType.vulnerable));
    },
    type: CardType.Attack,
    effect: CardEffectType.MultiTarget,
    description: `Deal {} damage and apply 1 Vulnerable to ALL enemies.`,
    descriptionVariables: ["damage"],
    targetEnemy: true,
    audio: heavyAtk,//TODO: sound effect
  });

export const cardMap = {
  strike: Strike,
  defend: Defend,
  bash: Bash,
  anger: Anger,
  bodySlam: BodySlam,
  clash: Clash,
  cleave: Cleave,
  clothesline: Clothesline,
  flex: Flex,
  havoc: Havoc,
  heavyBlade: HeavyBlade,
  ironWave: IronWave,
  perfectedStrike: PerfectedStrike,
  pommelStrike: PommelStrike,
  shrugItOff: ShrugItOff,
  swordBoomerang: SwordBoomerang,
  thunderclap: Thunderclap,
};