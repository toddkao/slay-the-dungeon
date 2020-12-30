import { random } from "lodash";
import { observable } from "mobx";
import { MonsterState, IntentType } from "./MonsterState";
import louseImage from "../../../Images/louse.png";
import jawWormImage from "../../../Images/jawworm.png";
import gremlinNobImage from "../../../Images/gremlin-nob.png";
import attackIntent from "../../../Images/attack-intent.png";
import spellIntent from "../../../Images/spell-intent.png";
import attackDebuff from "../../../Images/attack-debuff.png";
import { BattleState } from "../../Battle/BattleState";

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
        height: 100,
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
      intent: () => {
        if (BattleState.get().currentTurn === 1) {
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
            type: IntentType.ATTACK,
            intentImage: attackDebuff,
            amount: 6,
            chance: 0.33,
          },
        ];
      },
    })
  );
};

export const monsterMap = {
  louse,
  jawWorm,
  gremlinNob,
};
