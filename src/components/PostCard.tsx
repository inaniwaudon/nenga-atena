import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { drawLineChars, mmToCanvasPx } from '../utils/draw';
import { Family } from '../utils/data';
import { drawFamilyImage } from '../utils/draw';
import { FontSizes, LineHeights, Part, Positions } from '../utils/style';

const Card = styled.div`
  width: ${100 * 3}px;
  height: ${148 * 3}px;
  border: solid 1px #999;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  position: relative;
`;

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
`;

const BorderCanvas = styled(Canvas)`
  pointer-events: none;
  z-index: 2;
`;

const BgImg = styled.img`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
`;

interface PostCardProps {
  families: Family[];
  selectedFamilyIndex: number;
  positions: Positions;
  fontSizes: FontSizes;
  lineHeights: LineHeights;
  addressMaxChars: number;
  selectedPart: Part;
  setSelectedPart: (part: Part) => void;
}

const PostCard = ({
  families,
  selectedFamilyIndex,
  positions,
  fontSizes,
  lineHeights,
  addressMaxChars,
  selectedPart,
  setSelectedPart,
}: PostCardProps) => {
  const width = 100;
  const height = 148;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasBorderRef = useRef<HTMLCanvasElement>(null);

  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const bounding = e.currentTarget.getBoundingClientRect();
    const x = e.pageX - bounding.left;
    const y = e.pageY - bounding.top;

    const mmToScreenPx = (mm: number) => {
      return (mm / 100) * 300;
    };

    const parts: Part[] = ['name', 'address', 'postalCode'];
    for (const part of parts) {
      const left = mmToScreenPx(positions[part][0] - 4);
      const right = mmToScreenPx(positions[part][0] + 4);
      const top = mmToScreenPx(positions[part][1] - 4);
      const bottom = mmToScreenPx(positions[part][1] + 4);
      if (left <= x && x <= right && top <= y && y <= bottom) {
        setSelectedPart(part);
        break;
      }
    }
  };

  useEffect(() => {
    if (!canvasBorderRef.current) {
      return;
    }
    const context = canvasBorderRef.current.getContext('2d');
    if (!context) {
      return;
    }
    context.clearRect(0, 0, canvasBorderRef.current.width, canvasBorderRef.current.height);
    context.lineWidth = 4;

    const parts: Part[] = ['name', 'address', 'postalCode'];
    for (const part of parts) {
      context.strokeStyle = selectedPart === part ? '#00f' : '#ccc';
      context.beginPath();
      context.moveTo(mmToCanvasPx(positions[part][0] - 4), mmToCanvasPx(positions[part][1]));
      context.lineTo(mmToCanvasPx(positions[part][0] + 4), mmToCanvasPx(positions[part][1]));
      context.moveTo(mmToCanvasPx(positions[part][0]), mmToCanvasPx(positions[part][1] - 4));
      context.lineTo(mmToCanvasPx(positions[part][0]), mmToCanvasPx(positions[part][1] + 4));
      context.stroke();
    }
  }, [selectedPart, positions, fontSizes, lineHeights]);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const context = canvasRef.current.getContext('2d');
    if (context && selectedFamilyIndex >= 0 && selectedFamilyIndex < families.length) {
      drawFamilyImage(
        families[selectedFamilyIndex],
        positions,
        fontSizes,
        lineHeights,
        addressMaxChars,
        canvasRef.current,
        context,
      );
    }
  }, [families, selectedFamilyIndex, positions, fontSizes, lineHeights, addressMaxChars]);

  return (
    <Card>
      <BorderCanvas
        width={mmToCanvasPx(width)}
        height={mmToCanvasPx(height)}
        ref={canvasBorderRef}
      />
      <Canvas
        width={mmToCanvasPx(width)}
        height={mmToCanvasPx(height)}
        ref={canvasRef}
        onMouseDown={onMouseDown}
      />
      <BgImg src="https://www.wanichan.com/office365/mac/word/2019/11/images/postcard.png" />
    </Card>
  );
};

export default PostCard;
