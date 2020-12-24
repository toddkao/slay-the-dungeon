import { action, computed } from "mobx";
import { IStatus, StatusType, StatusTypeToIStatus } from "../Common/StatusBar";

export interface IEntity {
  statuses: IStatus[];
  id: string;
  health: number;
  maxHealth: number;
  damage: number;
  block: number;
}

export class Entity {
  @computed
  get get() {
    return this.entity;
  }

  @computed
  get extradamage() {
    return (
      this.get.statuses.find(
        (findStatus) => findStatus.type === StatusType.strength
      )?.amount ?? 0
    );
  }

  @computed
  get extrablock() {
    return (
      this.get.statuses.find(
        (findStatus) => findStatus.type === StatusType.dexterity
      )?.amount ?? 0
    );
  }

  public addStatus = action((type: StatusType, amount: number = 1) => {
    const statusFound = this.get.statuses.find(
      (status) => status.type === type
    );
    if (statusFound) {
      this.entity.statuses = this.get.statuses.map((status) =>
        status.type === type
          ? { ...status, amount: status.amount + amount }
          : status
      );
    } else {
      this.entity.statuses.push({
        type,
        amount,
        degrades: StatusTypeToIStatus[type].degrades,
      });
    }
  });

  public updateStatuses = action(() => {
    this.entity.statuses = this.get.statuses.map((status) =>
      status.degrades ? { ...status, amount: (status.amount ?? 0) - 1 } : status
    );
  });

  public takeDamage = action((amount: number) => {
    if (
      this.entity.block === undefined ||
      this.entity.health === undefined ||
      this.entity.statuses === undefined
    ) {
      return;
    }

    const currentBlock = this.get.block;

    if (currentBlock > amount) {
      this.entity.block -= amount;
    } else if (currentBlock + this.get.health > amount) {
      this.entity.block = 0;
      this.entity.health -= amount - currentBlock;
    } else {
      this.entity.health = 0;
    }

  });

  public cleanupStatuses = action(() => {
    if (this.entity.statuses === undefined) {
      return;
    }

    this.entity.statuses = this.entity.statuses.filter(
      (status) => (status.amount ?? 0) > 0
    );
  });

  public addBlock = action((amount: number) => {
    if (this.entity.block === undefined) {
      return;
    }
    this.entity.block += amount;
  });

  public clearBlock = action(() => {
    this.entity.block = 0;
  });

  constructor(
    private entity: IEntity = {
      health: 0,
      block: 0,
      damage: 0,
      id: "",
      maxHealth: 0,
      statuses: [],
    }
  ) {
  }
}
