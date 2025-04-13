export const zodiacSigns = ['Mesha', 'Vrishabha', /* ... */];
export const vedicOrderPositions = [[0, 1], [0, 2], /* ... */];

export function getRashiPosition(rashi: string): [number, number] {
  const index = zodiacSigns.indexOf(rashi);
  return index !== -1 ? vedicOrderPositions[index] : [0, 0];
}