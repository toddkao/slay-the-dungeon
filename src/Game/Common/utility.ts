import { Howl, HowlOptions } from "howler";
import { DeepPartial } from 'utility-types/dist/mapped-types';

export declare function buildProto<T>(partial:DeepPartial<T>): T;

interface IBoundingRect {
  x: number;
  y: number;
  height: number;
  width: number;
}

export const isCollidingWithEachOther = (
  a: IBoundingRect,
  b: IBoundingRect
) => {
  if (
    a?.x &&
    a?.y &&
    a?.height &&
    a?.width &&
    b?.x &&
    b?.y &&
    b?.height &&
    b?.width
  ) {
    const height = Math.min(
      Math.abs(a.y + a.height - b.y),
      Math.abs(a.y - (b.y + b.height))
    );

    const width = Math.min(
      Math.abs(a.x + a.width - b.x),
      Math.abs(a.x - (b.x + b.width))
    );

    return {
      collides: !(
        a.y + a.height < b.y ||
        a.y > b.y + b.height ||
        a.x + a.width < b.x ||
        a.x > b.x + b.width
      ),
      amount: height * width,
    };
  }
  return {
    collides: false,
    amount: 0,
  };
};

export const playAudioClip = (src?: string, options?: HowlOptions) => {
  if (!src) {
    return;
  }
  const sound = new Howl({
    src: [src],
    ...{
      ...options,
      volume: 0.2,
    },
  });

  return new Promise((resolve) => {
    sound.on("end", () => {
      resolve(sound);
    });
    sound.play();
  });
};