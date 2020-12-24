import React from "react";
import styled from "styled-components";
import { Column, Row } from "../../Layout";
import { Modal } from "../Common/Modal";
import { Player } from "../Entities/Player/Player";
import { range } from "lodash";
import { ArrowArea } from "react-arrow-master";

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
  const layersOfNodes = range(0, 16);

  return (
    <Modal>
      <ArrowArea arrows={[]}>
        <Column style={{ gap: 200, maxHeight: "80vh", overflow: "auto" }}>
          {layersOfNodes.map((layer, rowIndex) => {
            const randomNumberOfNodes =
              rowIndex === 0
                ? 1
                : rowIndex === 15
                ? 4
                : Math.floor(Math.random() * 3) + 2;
            return (
              <Row style={{ gap: 100, position: "relative", width: "60vw" }}>
                {range(0, randomNumberOfNodes).map((colIndex) => (
                  <MapNode
                    id={`row:${rowIndex}-col:${colIndex}`}
                    key={`row:${rowIndex}-col:${colIndex}`}
                    style={{
                      left:
                        (Math.floor(Math.random() * 40) + 150) * (colIndex + 1),
                      top: Math.floor(Math.random() * 60) + 100,
                    }}
                  />
                ))}
              </Row>
            );
          })}
        </Column>
      </ArrowArea>
    </Modal>
  );
}
