export default function (
  r: number,
  g: number,
  b: number,
  a: number = 1,
) {
  return {
    r: r / 255,
    g: g / 255,
    b: b / 255,
    a: 1,
  };
}
