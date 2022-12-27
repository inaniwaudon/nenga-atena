import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { drawLineChars, mmToCanvasPx } from '../utils/canvas';
import { Family } from '../utils/data';
import { loadFont } from '../utils/font';
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

const consistentAddress = (address: string) => {
  return address
    .replace(/[A-Za-z0-9]/g, (s) => String.fromCharCode(s.charCodeAt(0) + 0xfee0))
    .replace(/-/g, '―');
};

interface PostCardProps {
  families: Family[];
  selectedFamilyIndex: number;
  positions: Positions;
  fontSizes: FontSizes;
  lineHeights: LineHeights;
  selectedPart: Part;
}

const PostCard = ({
  families,
  selectedFamilyIndex,
  positions,
  fontSizes,
  lineHeights,
  selectedPart,
}: PostCardProps) => {
  const width = 100;
  const height = 148;
  const scale = 3;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasBorderRef = useRef<HTMLCanvasElement>(null);

  const drawFamily = async (
    family: Family,
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
  ) => {
    await loadFont();
    context.fillStyle = '#fff';
    //context.fillRect(0, 0, canvas.width, canvas.height);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#000';

    const fontName = 'shipporiMedium';

    // postal code
    drawLineChars(
      family.postalCode,
      positions.postalCode,
      fontName,
      fontSizes.postalCode,
      7.4,
      false,
      context,
    );

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
      drawLineChars(
        addressLines[linei],
        [
          positions.address[0] - lineHeights.address * linei,
          positions.address[1] + fontSizes.address * linei,
        ],
        fontName,
        fontSizes.address,
        fontSizes.address,
        true,
        context,
      );
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
      const x = positions.name[0] - namei * lineHeights.name;
      const name = consistentAddress(
        (namei === 0 ? familyName : '　'.repeat(familyName.length)) + names[namei],
      );
      drawLineChars(
        name,
        [x, positions.name[1]],
        fontName,
        fontSizes.name,
        fontSizes.name,
        true,
        context,
      );
      const suffixRatio = 0.7;
      const suffixY =
        positions.name[1] + fontSizes.name * (familyName.length + maxPersonalNameLength) + 4;
      drawLineChars(
        '様',
        [x - (fontSizes.name * (1.0 - suffixRatio)) / 2, suffixY],
        fontName,
        fontSizes.name * suffixRatio,
        0,
        true,
        context,
      );
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
    if (canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      // const ascender = 880;
      if (context) {
        if (selectedFamilyIndex >= 0 && selectedFamilyIndex < families.length) {
          drawFamily(families[selectedFamilyIndex], canvasRef.current, context);
        }
      }
    }
  }, [families, selectedFamilyIndex, positions, fontSizes, lineHeights]);

  return (
    <Card>
      <BorderCanvas
        width={mmToCanvasPx(width)}
        height={mmToCanvasPx(height)}
        ref={canvasBorderRef}
      />
      <Canvas width={mmToCanvasPx(width)} height={mmToCanvasPx(height)} ref={canvasRef} />
      <BgImg src="https://www.wanichan.com/office365/mac/word/2019/11/images/postcard.png" />
    </Card>
  );
};

export default PostCard;
