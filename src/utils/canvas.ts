import { drawPath } from '../utils/font';

const dpi = 350;

export const mmToCanvasPx = (mm: number) => {
  const canvasScale = dpi * 0.03937;
  return mm * canvasScale;
};

export const drawLineChars = (
  text: string,
  position: [number, number],
  fontName: string,
  fontSize: number,
  advance: number,
  isVertical: boolean,
  context: CanvasRenderingContext2D,
) => {
  const ascender = 880 / 1000;
  for (let chari = 0; chari < text.length; chari++) {
    const x = isVertical ? position[0] - fontSize : position[0] + advance * chari;
    const y = (isVertical ? position[1] + advance * chari : position[1]) + fontSize * ascender;
    drawPath(text[chari], mmToCanvasPx(fontSize), mmToCanvasPx(x), mmToCanvasPx(y), context);
  }
};
