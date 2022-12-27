export type Part = 'postalCode' | 'address' | 'name';

export type Positions = { [key in Part]: [number, number] };
export type FontSizes = { [key in Part]: number };
export type LineHeights = { [key in Part]: number };
