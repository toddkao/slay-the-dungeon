import { random } from "lodash";
import { observable } from "mobx";
import { Monster, IntentType } from "./Monster";
import louse from "../../../Images/louse.png";
import jawworm from "../../../Images/jawworm.png";
import attackIntent from "../../../Images/attack-intent.png";
import spellIntent from "../../../Images/spell-intent.png";

const Louse = (id: string) => {
  const health = random(10, 25);
  return new Monster(
    observable({
      id,
      name: "Louse",
      health,
      maxHealth: health,
      damage: 6,
      block: 0,
      image: louse,
      statuses: [],
      intent: [
        {
          type: IntentType.ATTACK,
          intentImage: attackIntent,
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

const JawWorm = (id: string) => {
  const health = random(40, 44);

  return new Monster(
    observable({
      id,
      name: "JawWorm",
      health,
      block: 0,
      maxHealth: health,
      statuses: [],
      damage: 11,
      image: jawworm,
      intent: [
        {
          type: IntentType.ATTACK,
          intentImage: attackIntent,
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

export const monsterMap = {
  louse: Louse,
  jawWorm: JawWorm,
};
