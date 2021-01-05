import { random } from "lodash";
import { observable } from "mobx";
import { MonsterState, IntentType } from "./MonsterState";

import louseImage from "../../../Images/louse.png";
import jawWormImage from "../../../Images/jawworm.png";
import gremlinNobImage from "../../../Images/gremlin-nob.png";
import slimeBossImage from "../../../Images/slime-boss.png";

import attackIntent from "../../../Images/attack-intent.png";
import spellIntent from "../../../Images/spell-intent.png";
import attackDebuff from "../../../Images/attack-debuff.png";
import debuff from "../../../Images/debuff.png";
import sickleAttack from "../../../Images/sickleAttack.png";
import unknown from "../../../Images/unknown.png";

import { BattleState } from "../../Battle/BattleState";
import { CardEffectType, CardState } from "../../Cards/CardState";
import { StatusType } from "../../Common/StatusBar";
import { AppEvent } from "../../../Events";

const louse = (id: string) => {
  const health = random(10, 25);
  return new MonsterState(
    observable({
      id,
      name: "Louse",
      health,
      maxHealth: health,
      block: 0,
      image: {
        src: louseImage,
        height: 100,
      },
      statuses: [],
      intent: () => [
        {
          type: IntentType.ATTACK,
          intentImage: attackIntent,
          amount: 6,
          chance: 0.75,
        },
        {
          type: IntentType.GAIN_STRENGTH,
          intentImage: spellIntent,
          chance: 0.25,
          amount: 3,
        },
      ],
    })
  );
};

const jawWorm = (id: string) => {
  const health = random(40, 44);

  return new MonsterState(
    observable({
      id,
      name: "Jaw Worm",
      health,
      block: 0,
      maxHealth: health,
      statuses: [],
      image: {
        src: jawWormImage,
        height: 150,
      },
      intent: () => [
        {
          type: IntentType.ATTACK,
          intentImage: attackIntent,
          amount: 11,
          chance: 0.75,
        },
        {
          type: IntentType.GAIN_STRENGTH,
          intentImage: spellIntent,
          chance: 0.25,
        },
      ],
    })
  );
};

const gremlinNob = (id: string) => {
  const health = random(82, 86);

  return new MonsterState(
    observable({
      id,
      name: "Gremlin Nob",
      health,
      block: 0,
      maxHealth: health,
      statuses: [],
      image: {
        src: gremlinNobImage,
        height: 350,
      },
      onCardPlayed: (card: CardState) => {
        AppEvent.cardPlayed({ card });
      },
      intent: () => {
        if (BattleState.get().currentTurn === 0) {
          return [
            {
              type: IntentType.ENRAGE,
              intentImage: spellIntent,
              amount: 3,
              chance: 1,
            },
          ];
        }
        return [
          {
            type: IntentType.ATTACK,
            intentImage: attackIntent,
            amount: 14,
            chance: 0.67,
          },
          {
            type: IntentType.ATTACK_DEBUFF,
            intentImage: attackDebuff,
            amount: 6,
            chance: 0.33,
            status: {
              type: StatusType.WEAK,
              target: CardEffectType.SPECIFIC_ENEMY,
              amount: 3,
              degrades: true,
            },
          },
        ];
      },
    })
  );
};

const slimeBoss = (id: string) => {
  const health = 140;

  return new MonsterState(
    observable({
      id,
      name: "Slime Boss",
      health,
      block: 0,
      maxHealth: health,
      statuses: [],
      image: {
        src: slimeBossImage,
        height: 300,
      },
      onStartingBattleEvents: () => {
        const monster = BattleState.get().monsters?.find(
          (monster) => monster.id === id
        );

        return [
          AppEvent.healthAtOrBelowHalf.on(() => {
            console.log('update intent');
            monster?.setCurrentIntent({
              type: IntentType.SPLIT,
              intentImage: unknown,
              amount: 2,
              chance: 1,
            });
          }),
        ];
      },
      onCardPlayed: () => {
        const slimeBoss = BattleState.get().monsters?.find(monster => monster.get.name === 'Slime Boss');

        if (slimeBoss && slimeBoss.health <= slimeBoss.maxHealth * 0.5) {
          AppEvent.healthAtOrBelowHalf();
        }
      },
      intent: () => {
        if (BattleState.get().currentTurn % 3 === 0) {
          return [
            {
              type: IntentType.GOOP_SPRAY,
              intentImage: debuff,
              amount: 3,
              chance: 1,
            },
          ];
        } else if (BattleState.get().currentTurn % 3 === 1) {
          return [
            {
              type: IntentType.NOTHING,
              intentImage: unknown,
              chance: 1,
            },
          ];
        } else {
          return [
            {
              type: IntentType.ATTACK,
              intentImage: sickleAttack,
              amount: 35,
              chance: 1,
            },
          ];
        }
      },
    })
  );
};

export const monsterMap = {
  louse,
  jawWorm,
  gremlinNob,
  slimeBoss,
};
