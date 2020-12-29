import { Howl, HowlOptions } from "howler";

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
    return !(
      a.y + a.height < b.y ||
      a.y > b.y + b.height ||
      a.x + a.width < b.x ||
      a.x > b.x + b.width
    );
  }
  return false;
};

export const playAudioClip = (src?: string, options?: HowlOptions) => {
  if (!src) {
    return;
  }
  const sound = new Howl({
    src: [src],
    ...{
      ...options,
      volume: 0.5,
    },
  });

  return new Promise((resolve) => {
    sound.on("end", () => {
      resolve(sound);
    });
    sound.play();
  });
};