export type Part = 'postalCode' | 'address' | 'name';

export type Positions = { [key in Part]: [number, number] };
export type FontSizes = { [key in Part]: number };
export type LineHeights = { [key in Part]: number };

export const saveStylesToLocalStorage = (
  positions: Positions,
  fontSizes: FontSizes,
  lineHeights: LineHeights,
  addressMaxChars: number,
  postalCodeAdvance: number,
) => {
  const json = JSON.stringify({
    positions,
    fontSizes,
    lineHeights,
    addressMaxChars,
    postalCodeAdvance,
  });
  localStorage.setItem('styles', json);
};
