import { action, computed } from "mobx";
import { StatusType } from "./StatusBar";
import { DeepPartial } from "./utility";

export interface IEntity {
  id: string;
  strength: number;
  dexterity: number;
  health: number;
  maxHealth: number;
  damage: number;
  block: number;
}

export class Entity {
  @computed
  get id() {
    return this.entity.id;
  }

  @computed
  get strength() {
    return this.entity.strength ?? 0;
  }

  @computed
  get dexterity() {
    return this.entity.dexterity ?? 0;
  }

  @computed
  get damage() {
    return this.entity.damage ?? 0;
  }

  @computed
  get block() {
    return this.entity.block ?? 0;
  }

  @computed
  get extradamage() {
    return this.strength;
  }

  @computed
  get extrablock() {
    return this.dexterity;
  }

  @computed
  get health() {
    return this.entity.health ?? 0;
  }

  @computed
  get maxHealth() {
    return this.entity.maxHealth ?? 0;
  }

  @computed
  get statuses() {
    return [
      ...(this.strength
        ? [
            {
              type: StatusType.strength,
              amount: this.strength,
            },
          ]
        : []),
      ...(this.dexterity
        ? [
            {
              type: StatusType.dexterity,
              amount: this.dexterity,
            },
          ]
        : []),
    ];
  }

  gainStrength = action((amount: number) => {
    if (this.entity.strength !== undefined) {
      this.entity.strength += amount;
    }
  });

  gainDexterity = action((amount: number) => {
    if (this.entity.dexterity !== undefined) {
      this.entity.dexterity += amount;
    }
  });

  takeDamage = action((amount: number) => {
    if (this.entity.block === undefined || this.entity.health === undefined) {
      return;
    }
    const currentBlock = this.block;
    if (currentBlock > amount) {
      this.entity.block -= amount;
    } else if (currentBlock + this.health > amount) {
      this.entity.block = 0;
      this.entity.health -= amount - currentBlock;
    } else {
      this.entity.health = 0;
    }
  });

  addBlock = action((amount: number) => {
    if (this.entity.block === undefined) {
      return;
    }
    this.entity.block += amount;
  });

  constructor(
    private entity: DeepPartial<IEntity> = {
      health: 0,
      block: 0,
    }
  ) {
    this.entity.maxHealth = this.entity.health;
    this.entity.block = 0;
    this.entity.dexterity = 0;
    this.entity.strength = 0;
  }
}
