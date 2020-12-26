import { action, computed } from "mobx";
import Chance from "chance";
import { Entity, IEntity } from "../entity";
import { StatusType } from "../../Common/StatusBar";

export class Monster extends Entity {
  constructor(private monster: IMonster) {
    super(monster);
    this.pickRandomIntent();
  }

  @computed
  get ref(): React.MutableRefObject<any> | undefined {
    return this.monster.ref;
  }
  set ref(ref: React.MutableRefObject<any> | undefined) {
    this.monster.ref = ref;
  }

  @computed
  get dead() {
    return this.monster.dead;
  }
  set dead(isDead: boolean | undefined) {
    this.monster.dead = isDead;
  }


  @computed
  public get get() {
    return this.monster;
  }

  @computed
  public get damage() {
    let weakStatus = this.monster.statuses.find(
      (status) => status.type === StatusType.weak
    );
    return weakStatus
      ? weakStatus?.amount >= 1
        ? Math.floor(this.monster.damage * 0.75)
        : this.monster.damage
      : this.monster.damage;
  }

  public pickRandomIntent = action(() => {
    const chance = new Chance();
    const intent: IIntent = chance.weighted(
      this.monster.intent,
      this.monster.intent.map((intent) => intent.chance)
    );
    this.setCurrentIntent(intent);
  });

  public setCurrentIntent = action((intent: IIntent) => {
    this.monster.currentIntent = intent;
  });
}

export enum IntentType {
  Attack,
  Shield,
  GainStrength,
}

interface IIntent {
  intentImage: string;
  chance: number;
  type: IntentType;
  amount?: number;
}

interface IMonster extends IEntity {
  name: string;
  image: string;
  intent: IIntent[];
  currentIntent?: IIntent;
  effect?: any;
  ref?: React.MutableRefObject<any>;
  dead?: boolean;
}
