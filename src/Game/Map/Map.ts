import { Singleton } from "@taipescripeto/singleton";
import monster from "../../Images/monster.png";
import chest from "../../Images/chest.png";
import rest from "../../Images/rest.png";
import shop from "../../Images/shop.png";
import event from "../../Images/event.png";
import elite from "../../Images/elite.png";
import { random, range, uniqueId } from "lodash";
import { action, computed, observable } from "mobx";
import { clone } from "lodash";
import { Battle } from "../Battle/Battle";
import { Monster } from "../Entities/Monster/Monster";
import { mapEncounterType } from "./MapEncounterDefinition";

interface IMapNode {
  id: string;
  type: mapNodeType;
  left: number;
  top: number;
  encounter: Monster[];
}

interface INodePath {
  start: string;
  end: string;
}

interface IMap {
  currentFloorNumber: 1;
  floors: {
    1: {
      matrix: IMapNode[][];
      paths: INodePath[];
    };
  };
  currentNode: IMapNode | undefined;
  traversedNodeIds: string[];
  currentEncounter: Monster[] | undefined;
  showingMap: boolean;
}

@Singleton()
export class Map {
  constructor(
    private map: IMap = observable({
      currentFloorNumber: 1,
      floors: {
        1: {
          matrix: [],
          paths: [],
        },
      },
      currentNode: undefined,
      traversedNodeIds: [],
      currentEncounter: undefined,
      showingMap: false,
    })
  ) {
    this.map.floors[1].matrix = range(0, 16).map((layer, rowIndex) => {
      const randomNumberOfNodes =
        rowIndex === 0
          ? 1
          : rowIndex === 15
          ? 4
          : Math.floor(Math.random() * 3) + 2;
      return range(0, randomNumberOfNodes).map((node, colIndex) => ({
        id: `row=${rowIndex}col=${colIndex}`,
        type: this.generateNodeType(rowIndex),
        encounter: this.generateEncounter(rowIndex),
        left:
          rowIndex === 0 && colIndex === 0
            ? 500
            : (Math.floor(Math.random() * 40) + 200) * (colIndex + 1),
        top:
          rowIndex === 0 && colIndex === 0
            ? 50
            : Math.floor(Math.random() * 60) + 100,
      }));
    });

    this.currentFloor.matrix.forEach((row, rowIndex) => {
      const currentRow = clone(row);
      const nextRow = clone(this.currentFloor.matrix[rowIndex + 1]);
      if (nextRow) {
        nextRow.forEach((node, index) => {
          if (currentRow[index]) {
            this.map.floors[1].paths.push({
              start: node.id,
              end: currentRow[index].id,
            });
          } else {
            this.map.floors[1].paths.push({
              start: node.id,
              end: currentRow[currentRow.length - 1].id,
            });
          }
          const randomNumber = random(0, 100);
          const leftNode = clone(row)[index - 1];
          const rightNode = clone(row)[index + 1];
          if (randomNumber < 10 && leftNode) {
            // connect to left node
            this.map.floors[1].paths.push({
              start: node.id,
              end: leftNode.id,
            });
          } else if (randomNumber < 20 && rightNode) {
            // connect to right node
            this.map.floors[1].paths.push({
              start: node.id,
              end: rightNode.id,
            });
          }
        });
      }
    });

    this.map.floors[1].matrix.forEach((row, rowIndex) => {
      const nextRow = clone(this.map.floors[1].matrix[rowIndex + 1]);
      if (nextRow) {
        row.forEach((node) => {
          if (
            !this.map.floors[1].paths.map((path) => path.end).includes(node.id)
          ) {
            this.map.floors[1].paths.push({
              start: nextRow[nextRow.length - 1].id,
              end: node.id,
            });
          }
        });
      }
    });
  }

  @computed
  get showingMap() {
    return this.map.showingMap;
  }

  @computed
  get floors() {
    return this.map.floors;
  }

  @computed
  get currentFloor() {
    return this.map.floors[this.map.currentFloorNumber];
  }

  @computed
  get currentEncounter() {
    return this.map.currentEncounter;
  }

  @computed
  get selectableNodeIds() {
    if (this.map.currentNode === undefined) {
      return this.currentFloor.matrix[this.currentFloor.matrix.length - 1].map(
        (node) => node.id
      );
    }
    return this.currentFloor.paths
      .filter((path) => {
        return path.start === this.map.currentNode?.id;
      })
      .map((node) => node.end);
  }

  @computed
  get currentNode() {
    return this.map.currentNode;
  }

  @computed
  get traversedNodeIds() {
    return this.map.traversedNodeIds;
  }

  setShowingMap = action((showingMap: boolean) => {
    this.map.showingMap = showingMap;
  });

  generateNodeType = (rowIndex: number) => {
    return rowIndex === 1 ? mapNodeType.rest : mapNodeType.monster;
  };

  generateEncounter = (rowIndex: number) => {
    const randomFirstThreeEncounterIndex = random(
      0,
      parseInt((mapEncounterType.firstThreeEncounters.length - 1) as any)
    );
    const randomNormalEncounterIndex = random(
      0,
      parseInt((mapEncounterType.normalEncounters.length - 1) as any)
    );

    return rowIndex >= 13
      ? mapEncounterType.firstThreeEncounters[
          randomFirstThreeEncounterIndex
        ].map((createMob) => createMob(uniqueId()))
      : mapEncounterType.normalEncounters[
          randomNormalEncounterIndex
        ].map((createMob) => createMob(uniqueId()));
  };

  selectNode = action((node: IMapNode) => {
    this.map.currentNode = node;
    if (this.currentNode !== undefined) {
      this.map.traversedNodeIds.push(this.currentNode?.id);
    }
    this.map.currentEncounter = this.currentNode?.encounter;
    const battleState = new Battle();
    battleState.initialize();
  });
}

export enum mapNodeType {
  monster,
  chest,
  rest,
  shop,
  event,
  elite,
}

export const mapNodeTypeToImage = {
  [mapNodeType.monster]: monster,
  [mapNodeType.chest]: chest,
  [mapNodeType.rest]: rest,
  [mapNodeType.shop]: shop,
  [mapNodeType.event]: event,
  [mapNodeType.elite]: elite,
};