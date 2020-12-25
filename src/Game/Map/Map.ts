import { Singleton } from "@taipescripeto/singleton";
import monster from "../../Images/monster.png";
import chest from "../../Images/chest.png";
import rest from "../../Images/rest.png";
import shop from "../../Images/shop.png";
import event from "../../Images/event.png";
import { range } from "lodash";
import { action, computed, observable } from "mobx";
import { clone } from "lodash";
import { Battle } from "../Battle/Battle";

interface IMapNode {
  id: string;
  type: mapNodeType;
  left: number;
  top: number;
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
  currentNode: string | undefined;
  traversedNodeIds: string[];
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
        type: mapNodeType.monster,
        left:
          rowIndex === 0 && colIndex === 0
            ? 500
            : (Math.floor(Math.random() * 40) + 150) * (colIndex + 1),
        top:
          rowIndex === 0 && colIndex === 0
            ? 50
            : Math.floor(Math.random() * 60) + 100,
      }));
    });

    this.map.floors[1].matrix.forEach((row, rowIndex) => {
      const currentRow = clone(row);
      const nextRow = clone(this.map.floors[1].matrix[rowIndex + 1]);
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
        });
      }
    });
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
  get selectableNodeIds() {
    if (this.map.currentNode === undefined) {
      return this.currentFloor.matrix[this.currentFloor.matrix.length - 1].map(
        (node) => node.id
      );
    }
    return this.currentFloor.paths
      .filter((path) => {
        return path.start === this.map.currentNode;
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

  selectNode = action((id: string) => {
    this.map.currentNode = id;
    if (this.currentNode !== undefined) {
      this.map.traversedNodeIds.push(this.currentNode);
    }
    const battleState = new Battle();
    battleState.resetBattleState();
  });
}

export enum mapNodeType {
  monster,
  chest,
  rest,
  shop,
  event,
}

export const mapNodeTypeToImage = {
  [mapNodeType.monster]: monster,
  [mapNodeType.chest]: chest,
  [mapNodeType.rest]: rest,
  [mapNodeType.shop]: shop,
  [mapNodeType.event]: event,
};
