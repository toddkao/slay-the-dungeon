import louse from "../Images/louse.png";
import jawworm from "../Images/jawworm.png";
import React from "react";
import { Column } from "../Layout";
import { HealthBar } from "./Common";

interface IMonster {
  name: string;
  health: number;
  maxHealth?: number;
  image: string;
  damage?: number;
  effect?: any;
}

export class Monster {
  constructor(public monster: IMonster) {
    monster.maxHealth = monster.health;
  }

  render = () => {
    return (
      <Column>
        <img src={this.monster.image} width={100} height={100} />
        <HealthBar
          health={this.monster.health}
          maxHealth={this.monster.maxHealth as number}
        />
      </Column>
    );
  };
}

export const Louse = new Monster({
  name: "Louse",
  health: 10,
  damage: 6,
  image: louse,
});

export const JawWorm = new Monster({
  name: "JawWorm",
  health: 40,
  damage: 11,
  image: jawworm,
});
