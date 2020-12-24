import React from "react";
import styled from "styled-components";
import { Column, Row } from "../../Layout";
import { Modal } from "../Common/Modal";
import { Player } from "../Entities/Player";
import { range } from "lodash";

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
      <Column style={{ gap: 200, maxHeight: "80vh", overflow: "auto" }}>
        {layersOfNodes.map((layer, index) => {
          console.log(index);
          const randomNumberOfNodes =
            index === 0
              ? 1
              : index === 15
              ? 4
              : Math.floor(Math.random() * 3) + 2;
          return (
            <Row style={{ gap: 100, position: "relative", width: "60vw" }}>
              {range(0, randomNumberOfNodes).map((index) => (
                <MapNode
                  key={index}
                  style={{
                    left: (Math.floor(Math.random() * 40) + 150) * (index + 1),
                    top: Math.floor(Math.random() * 60) + 100,
                  }}
                />
              ))}
            </Row>
          );
        })}
      </Column>
    </Modal>
  );
}
