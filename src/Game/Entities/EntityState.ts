import { clone } from "lodash";
import { action, computed, observable } from "mobx";
import { IStatus, StatusType, StatusTypeToIStatus } from "../Common/StatusBar";
import { playAudioClip } from "../Common/utility";

export interface IEntity {
  statuses: IStatus[];
  id: string;
  health: number;
  maxHealth: number;
  block: number;
}

export class EntityState {
  @computed
  get id() {
    return this.entity.id;
  }

  @computed
  get block() {
    return this.entity.block;
  }

  @computed
  get strength() {
    return (
      this.statuses.find(
        (findStatus) => findStatus.type === StatusType.STRENGTH
      )?.amount || 0
    );
  }

  @computed
  get damageMultiplier() {
    return (
      this.statuses.find(
        (findStatus) => findStatus.type === StatusType.WEAK
      ) ? 0.75 : 1
    );
  }

  @computed
  get dexterity() {
    return (
      this.statuses.find(
        (findStatus) => findStatus.type === StatusType.DEXTERITY
      )?.amount || 0
    );
  }

  @computed
  get blockMultiplier() {
    return 1;
  }

  @computed
  get health() {
    return this.entity.health;
  }

  @computed
  get maxHealth() {
    return this.entity.maxHealth;
  }

  @computed
  get statuses() {
    return this.entity.statuses;
  }

  public addStatus = action((type: StatusType, amount: number = 1) => {
    const statusFound = this.statuses.find((status) => status.type === type);
    if (statusFound) {
      this.entity.statuses = this.statuses.map((status) =>
        status.type === type
          ? { ...status, amount: status.amount + amount }
          : status
      );
    } else {
      this.entity.statuses.push({
        type,
        amount,
        degrades: StatusTypeToIStatus[type]?.degrades,
        fleeting: StatusTypeToIStatus[type]?.fleeting,
      });
    }
    playAudioClip(StatusTypeToIStatus[type]?.audio);
  });

  public removeStatus = action((type: StatusType, amount: number = -1) => {
    this.addStatus(type, amount * -1);
  });

  public updateStatuses = action(() => {
    const oldStatuses = clone(this.entity.statuses);
    this.entity.statuses.length = 0;
    this.entity.statuses.push(
      ...oldStatuses.filter(
        (status) => {
          if (status.degrades) {
            status.amount -= 1;
          }
          return status.amount > 0 && !status.fleeting;
        }
      )
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

  public addBlock = action((amount: number) => {
    if (this.entity.block === undefined) {
      return;
    }
    this.entity.block +=
      amount +
      (this.statuses.find((status) => status.type === StatusType.DEXTERITY)
        ?.amount ?? 0);
  });

  public clearBlock = action(() => {
    this.entity.block = 0;
  });

  public reset = action(() => {
    this.entity.health = this.maxHealth;
    this.entity.block = 0;
    this.entity.statuses = [];
  });

  constructor(
    private entity: IEntity = observable({
      id: "",
      health: 0,
      block: 0,
      maxHealth: 0,
      statuses: [],
    })
  ) {}
}
