import { atom } from 'jotai';
import { uniqueId } from 'lodash';
import { MonsterState } from '../Game/Entities/Monster/MonsterState';

export enum MapNodeType {
  MONSTER,
  CHEST,
  REST,
  SHOP,
  EVENT,
  ELITE,
}

export interface MapNode {
  id: string;
  type: MapNodeType;
  left: number;
  top: number;
  encounter?: MonsterState[];
}

export interface MapState {
  currentNode?: MapNode;
  traversedNodeIds: string[];
  currentEncounter?: MonsterState[];
  showingMap: boolean;
}

const initialMapState: MapState = {
  currentNode: undefined,
  traversedNodeIds: [],
  currentEncounter: undefined,
  showingMap: false,
};

export const mapAtom = atom<MapState>(initialMapState);

export const setShowingMapAtom = atom(null, (get, set, showing: boolean) => {
  const current = get(mapAtom);
  set(mapAtom, { ...current, showingMap: showing });
});

export const selectNodeAtom = atom(null, (get, set, node: MapNode) => {
  const current = get(mapAtom);
  set(mapAtom, {
    ...current,
    currentNode: node,
    traversedNodeIds: [...current.traversedNodeIds, node.id],
    currentEncounter: node.encounter,
  });
});
