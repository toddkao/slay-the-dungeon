import { MonsterState } from "../Entities/Monster/MonsterState";

import { monsterMap } from "../Entities/Monster/MonsterDefinitions";

interface IMapEncounterType {
  [index: string]: ((id: string) => MonsterState)[][];
}

export const mapEncounterType: IMapEncounterType = {
  firstThreeEncounters: [
    // [monsterMap.slimeBoss],
    [monsterMap.louse, monsterMap.louse],
    [monsterMap.jawWorm],
  ],
  normalEncounters: [
    [monsterMap.louse, monsterMap.louse, monsterMap.louse],
    [monsterMap.jawWorm, monsterMap.jawWorm],
  ],
  eliteEncounters: [[monsterMap.gremlinNob]],
};
