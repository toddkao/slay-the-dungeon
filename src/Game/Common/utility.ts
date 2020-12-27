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
