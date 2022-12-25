import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Family } from '../utils/data';
import { drawPath, loadFont } from '../utils/font';

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
  return address
    .replace(/[A-Za-z0-9]/g, (s) => String.fromCharCode(s.charCodeAt(0) + 0xfee0))
    .replace(/-/g, '―');
};

const PostCard = ({ families, selectedFamilyIndex }: PostCardProps) => {
  const width = 100;
  const height = 148;
  const scale = 3;

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const positions: { [key in part]: [number, number] } = {
    postalCode: [44, 16],
    address: [86, 30],
    name: [60, 56],
  };
  const fontSizes: { [key in part]: number } = {
    postalCode: 8,
    address: 4,
    name: 10,
  };
  const lineHeights: { [key in part]: number } = {
    postalCode: 8,
    address: 6,
    name: 13,
  };

  const drawFamily = async (
    family: Family,
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
  ) => {
    await loadFont();
    context.fillStyle = '#fff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#000';

    // postal code
    for (let i = 0; i < family.postalCode.length; i++) {
      drawPath(
        family.postalCode[i],
        mmToCanvasPx(fontSizes.postalCode),
        mmToCanvasPx(positions.postalCode[0] + i * 7.4),
        mmToCanvasPx(positions.postalCode[1]),
        context,
      );
    }

    // address
    const address0 = consistentAddress(family.prefecture + family.municipalities);
    const address1 = consistentAddress(family.address);
    const address2 = consistentAddress(family.building);
    const maxLength = 20;

    const addressLines: string[] = [address0];
    if (addressLines.at(-1)!.length + address1.length > maxLength) {
      addressLines.push('');
    }
    addressLines[addressLines.length - 1] = addressLines.at(-1) + address1;
    if (addressLines.at(-1)!.length + address2.length > maxLength) {
      addressLines.push('');
    }
    addressLines[addressLines.length - 1] = addressLines.at(-1) + address2;

    for (let linei = 0; linei < addressLines.length; linei++) {
      for (let chari = 0; chari < addressLines[linei].length; chari++) {
        drawPath(
          addressLines[linei][chari],
          mmToCanvasPx(fontSizes.address),
          mmToCanvasPx(positions.address[0] - linei * lineHeights.address),
          mmToCanvasPx(positions.address[1] + (chari + linei) * fontSizes.address),
          context,
        );
      }
    }

    // name
    const names = [
      family.personalName,
      family.consecutiveName1,
      family.consecutiveName2,
      family.consecutiveName3,
    ].filter((name) => name.length > 0);
    const maxPersonalNameLength = Math.max(...names.map((name) => name.length));
    const familyName =
      family.familyName + (family.familyName.length + maxPersonalNameLength < 4 ? '　' : '');

    for (let namei = 0; namei < names.length; namei++) {
      const name = (namei === 0 ? familyName : '　'.repeat(familyName.length)) + names[namei];
      const x = positions.name[0] - namei * lineHeights.name;
      for (let chari = 0; chari < name.length; chari++) {
        const y = positions.name[1] + chari * fontSizes.name;
        drawPath(
          name[chari],
          mmToCanvasPx(fontSizes.name),
          mmToCanvasPx(x),
          mmToCanvasPx(y),
          context,
        );
        // ascender;
      }
      const prefixY =
        positions.name[1] + fontSizes.name * (familyName.length + maxPersonalNameLength);
      drawPath(
        '様',
        mmToCanvasPx(fontSizes.name * 0.7),
        mmToCanvasPx(x + (fontSizes.name * (1 - 0.7)) / 2),
        mmToCanvasPx(prefixY),
        context,
      );
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
