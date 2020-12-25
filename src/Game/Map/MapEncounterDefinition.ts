import { uniqueId } from "lodash";
import { Monster } from "../Entities/Monster/Monster";

import { monsterMap } from "../Entities/Monster/MonsterDefinitions";

interface IMapEncounterType {
  [index: string]: ((id: string) => Monster)[][];
}

export const mapEncounterType: IMapEncounterType = {
  firstThreeEncounters: [
    [monsterMap.louse, monsterMap.louse],
    [monsterMap.jawWorm],
  ],
  normalEncounters: [
    [monsterMap.louse, monsterMap.louse, monsterMap.louse],
    [monsterMap.jawWorm, monsterMap.jawWorm],
  ],
};
