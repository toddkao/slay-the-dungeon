import { action, computed } from "mobx";
import Chance from "chance";
import { EntityState, IEntity } from "../EntityState";
import { IStatus } from "../../Common/StatusBar";
import { Unsubscribe } from "ts-event-bus/build/Slot";
import { CardState } from "../../Cards/CardState";

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

  @computed
  public get currentIntent() {
    if (this.monster.currentIntent?.type === IntentType.ATTACK) {
      return {
        ...this.monster.currentIntent,
        amount: Math.floor((this.monster.currentIntent?.amount ?? 0) + this.strength * this.damageMultiplier)
      };
    }
    if (this.monster.currentIntent?.type === IntentType.SHIELD) {
      return {
        ...this.monster.currentIntent,
        amount: Math.floor((this.monster.currentIntent?.amount ?? 0) + this.dexterity)
      };
    }
    return this.monster.currentIntent;
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
  ATTACK_DEBUFF,
  SHIELD,
  GAIN_STRENGTH,
  ENRAGE,
  GOOP_SPRAY,
  NOTHING,
  SPLIT,
  DEBUFF,
}

interface IIntent {
  intentImage: string;
  chance: number;
  type: IntentType;
  amount?: number;
  status?: IStatus;
}

interface IMonster extends IEntity {
  name: string;
  image: {
    src: string;
    height: number;
  };
  intent: () => IIntent[];
  currentIntent?: IIntent;
  event?: () => void;
  effect?: any;
  ref?: React.MutableRefObject<any>;
  dead?: boolean;
  onStartingBattleEvents?: () => Unsubscribe[];
  onCardPlayed?: (card: CardState) => void;
}
