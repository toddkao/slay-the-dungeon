import { action, computed } from "mobx";
import Chance from "chance";
import { EntityState, IEntity } from "../EntityState";
import { StatusType } from "../../Common/StatusBar";

export class MonsterState extends EntityState {
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
    return this.monster.health <= 0;
  }

  @computed
  public get get() {
    return this.monster;
  }

  public pickRandomIntent = action(() => {
    const chance = new Chance();
    const intent: IIntent = chance.weighted(
      this.monster.intent(),
      this.monster.intent().map((intent) => intent.chance)
    );
    this.setCurrentIntent(intent);
  });

  public setCurrentIntent = action((intent: IIntent) => {
    this.monster.currentIntent = intent;
  });
}

export enum IntentType {
  SLEEP,
  ATTACK,
  SHIELD,
  GAIN_STRENGTH,
  ENRAGE,
}

interface IIntent {
  intentImage: string;
  chance: number;
  type: IntentType;
  amount?: number;
}

interface IMonster extends IEntity {
  name: string;
  image: {
    src: string;
    height: number;
  };
  intent: () => IIntent[];
  currentIntent?: IIntent;
  effect?: any;
  ref?: React.MutableRefObject<any>;
  dead?: boolean;
}
