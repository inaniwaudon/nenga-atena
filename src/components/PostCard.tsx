import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Family } from '../utils/data';

const Card = styled.div<{ width: number; height: number }>`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
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

const BgImg = styled.img`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
`;

const dpi = 350;

const mmToCanvasPx = (mm: number) => {
  const canvasScale = dpi * 0.03937;
  return mm * canvasScale;
};

type part = 'postalCode' | 'address' | 'name';

interface PostCardProps {
  families: Family[];
  selectedFamilyIndex: number;
}

const consistentAddress = (address: string) => {
  return address.replace(/[A-Za-z0-9]/g, (s) => String.fromCharCode(s.charCodeAt(0) + 0xfee0));
};

const PostCard = ({ families, selectedFamilyIndex }: PostCardProps) => {
  const width = 100;
  const height = 148;
  const scale = 3;

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const positions: { [key in part]: [number, number] } = {
    postalCode: [44, 16],
    address: [86, 30],
    name: [60, 50],
  };
  const fontSizes: { [key in part]: number } = {
    postalCode: 8,
    address: 4,
    name: 10,
  };
  const lineHeights: { [key in part]: number } = {
    postalCode: 8,
    address: 6,
    name: 12,
  };

  const drawChar = (char: string, x: number, y: number, context: CanvasRenderingContext2D) => {
    context.fillText(char, x, y);
  };

  const drawFamily = (
    family: Family,
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
  ) => {
    context.clearRect(0, 0, canvas.width, canvas.height);

    // postal code
    context.font = `${mmToCanvasPx(fontSizes.postalCode)}px sans-serif`;
    for (let i = 0; i < family.postalCode.length; i++) {
      drawChar(
        family.postalCode[i],
        mmToCanvasPx(positions.postalCode[0] + i * 7.4),
        mmToCanvasPx(positions.postalCode[1]),
        context,
      );
    }

    // address
    context.font = `${mmToCanvasPx(fontSizes.address)}px sans-serif`;
    const address = consistentAddress(
      family.prefecture + family.municipalities + family.address + family.building,
    );
    for (let i = 0; i < address.length; i++) {
      drawChar(
        address[i],
        mmToCanvasPx(positions.address[0]),
        mmToCanvasPx(positions.address[1] + i * fontSizes.address),
        context,
      );
    }

    // name
    context.font = `${mmToCanvasPx(fontSizes.name)}px sans-serif`;
    const names = [family.personalName, family.consecutiveName1, family.consecutiveName2].filter(
      (name) => name.length > 0,
    );
    for (let namei = 0; namei < names.length; namei++) {
      const name = family.familyName + names[namei];
      const x = positions.name[0] - namei * lineHeights.name;
      for (let chari = 0; chari < name.length; chari++) {
        const y = positions.name[1] + chari * fontSizes.name;
        drawChar(name[chari], mmToCanvasPx(x), mmToCanvasPx(y), context);
        // ascender;
      }
    }
  };

  useEffect(() => {
    if (canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      // const ascender = 880;
      if (context) {
        if (selectedFamilyIndex >= 0 && selectedFamilyIndex < families.length) {
          drawFamily(families[selectedFamilyIndex], canvasRef.current, context);
        }
      }
    }
  }, [families, selectedFamilyIndex]);

  return (
    <Card width={width * scale} height={height * scale}>
      <Canvas width={mmToCanvasPx(width)} height={mmToCanvasPx(height)} ref={canvasRef} />
      <BgImg src="https://www.wanichan.com/office365/mac/word/2019/11/images/postcard.png" />
    </Card>
  );
};

export default PostCard;
