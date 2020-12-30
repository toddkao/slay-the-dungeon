import { MonsterState } from "../Entities/Monster/MonsterState";

import { monsterMap } from "../Entities/Monster/MonsterDefinitions";

interface IMapEncounterType {
  [index: string]: ((id: string) => MonsterState)[][];
}

export const mapEncounterType: IMapEncounterType = {
  firstThreeEncounters: [
    // [monsterMap.louse, monsterMap.louse],
    // [monsterMap.jawWorm],
    [monsterMap.gremlinNob]
  ],
  normalEncounters: [
    [monsterMap.louse, monsterMap.louse, monsterMap.louse],
    [monsterMap.jawWorm, monsterMap.jawWorm],
  ],
  eliteEncounters: [[monsterMap.jawWorm, monsterMap.jawWorm]],
};
