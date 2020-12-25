import React from "react";
import styled from "styled-components";
import { Column, Row } from "../../Layout";
import { Modal } from "../Common/Modal";
import { Player } from "../Entities/Player/Player";
import { clone, range } from "lodash";
import Xarrow from "react-xarrows";

const Wrapper = styled(Row)`
  width: 100vw;
  height: 100vh;
`;

const MapNode = styled.div`
  background-color: black;
  border-radius: 50%;
  height: 40px;
  width: 40px;
  position: absolute;
`;

export function Map() {
  const player = new Player();
  const matrixOfNodes = range(0, 16).map((layer, rowIndex) => {
    const randomNumberOfNodes =
      rowIndex === 0
        ? 1
        : rowIndex === 15
        ? 4
        : Math.floor(Math.random() * 3) + 2;
    return range(0, randomNumberOfNodes).map(
      (node, colIndex) => `row=${rowIndex}col=${colIndex}`
    );
  });

  console.table(matrixOfNodes);
  let arrows: any[] = [];
  
  matrixOfNodes.forEach((row, rowIndex) => {
    const currentRow = clone(row);
    const nextRow = clone(matrixOfNodes[rowIndex + 1]);
    if (nextRow) {

      nextRow.forEach((node, index) => {
        if (currentRow[index]) {
          arrows.push({
            start: node,
            end: currentRow[index],
          });
        } else {
          arrows.push({
            start: node,
            end: currentRow[currentRow.length - 1],
          });
        }
      })

      // const leastNodesRowIndex =
      //   currentRow.length < nextRow.length ? rowIndex : rowIndex + 1;
      // const mostNodesRowIndex =
      //   currentRow.length < nextRow.length ? rowIndex + 1 : rowIndex;

      // let pointerLeft = 0;
      // let pointerRight = leastNodes.length - 1;
      // while (leastNodes.length > 0) {
      //   const leastNodesLeft = leastNodes.unshift();
      //   const leastNodesRight = leastNodes.pop();
      //   const mostNodesLeft = mostNodes.unshift();
      //   const mostNodesRight = mostNodes.pop();

      //   if (leastNodesLeft && mostNodesLeft) {
      //     const leastNodesId = `row=${leastNodesRowIndex}col=${pointerLeft}`;
      //     const mostNodesId = `row=${mostNodesRowIndex}col=${pointerLeft}`;

      //     arrows.push({
      //       start: leastNodesId,
      //       end: mostNodesId,
      //     });
      //   }

      //   if (leastNodesRight && mostNodesRight) {
      //     const leastNodesId = `row=${leastNodesRowIndex}col=${pointerRight}`;
      //     const mostNodesId = `row=${mostNodesRowIndex}col=${pointerRight}`;

      //     arrows.push({
      //       start: leastNodesId,
      //       end: mostNodesId,
      //     });
      //   }

      //   console.log(mostNodes);
        // pointerLeft++;
        // pointerRight--;
      // }
    }
  });
  return (
    <Modal>
      <Column style={{ gap: 200, maxHeight: "80vh", overflow: "auto" }}>
        {matrixOfNodes.map((row, rowIndex) => {
          return (
            <Row
              key={`row=${rowIndex}`}
              style={{ gap: 100, position: "relative", width: "60vw" }}
            >
              {row.map((id, colIndex) => (
                <MapNode
                  id={id}
                  key={id}
                  style={{
                    left:
                      (Math.floor(Math.random() * 40) + 150) * (colIndex + 1),
                    top: Math.floor(Math.random() * 60) + 100,
                  }}
                />
              ))}
              {arrows.map((arrow) => {
                return (
                  <Xarrow
                    start={arrow.start}
                    end={arrow.end}
                    path="straight"
                    headSize={0}
                    dashness={true}
                    lineColor="black"
                  />
                );
              })}
            </Row>
          );
        })}
      </Column>
    </Modal>
  );
}
