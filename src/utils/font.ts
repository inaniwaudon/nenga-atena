import opentype, { Font } from 'opentype.js';

const fontPaths = { shipporiMedium: 'fonts/ShipporiMincho-OTF-Medium.otf' };
const fonts: { [key in string]: { font: Font; substitutions: Substitution[] } } = {};

export interface Substitution {
  sub: number;
  by: number;
}

export const substituteVertGlyph = (font: Font): Substitution[] => {
  const scriptList = ['hani', 'kana', 'DFLT', 'latn'];
  const languageList = ['', 'JAP', 'LAT '];
  let result: Substitution[] = [];
  for (const script of scriptList) {
    for (const language of languageList) {
      const fontSubstitution: any = font.substitution;
      result = [...result, ...fontSubstitution.getSingle('vert', script, language)];
    }
  }
  return result;
};

export const loadFont = () =>
  new Promise<void>((resolve, reject) => {
    if ('shipporiMedium' in fonts) {
      resolve();
      return;
    }
    opentype.load(fontPaths.shipporiMedium, (err, font) => {
      if (err) {
        alert('Font could not be loaded: ' + err);
        reject();
      } else if (font !== undefined) {
        fonts['shipporiMedium'] = { font, substitutions: substituteVertGlyph(font) };
        resolve();
      }
    });
  });

export const drawPath = (
  char: string,
  size: number,
  x: number,
  y: number,
  context: CanvasRenderingContext2D,
) => {
  const font = fonts['shipporiMedium'];
  let gid = font.font.charToGlyphIndex(char);
  const vertSubstitution = font.substitutions.find((s) => s.sub === gid);
  if (vertSubstitution) {
    gid = vertSubstitution.by;
  }
  const path = font.font.glyphs.get(gid).getPath(x, y, size);
  path.draw(context);
};
