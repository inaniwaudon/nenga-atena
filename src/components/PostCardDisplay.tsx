import React, { useState } from 'react';
import styled from 'styled-components';
import PostCard from './PostCard';
import SwitchButton from './SwitchButton';
import { keyColor } from '../const/style';
import { Family } from '../utils/family';
import { Button, InputBox } from '../utils/components';
import { Part, FontSizes, LineHeights, Positions } from '../utils/style';

const Navigation = styled.nav`
  margin: 10px 0 10px 0;
  display: flex;
  justify-content: right;
  gap: 10px;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const DetailedLine = styled.div``;

const LeftLabel = styled.div`
  width: 4em;
  margin-right: 10px;
  display: inline-block;
`;

const Input = styled(InputBox)<{ length: number }>`
  width: ${(props) => props.length}em;
`;

interface PostCardDisplayProps {
  selectedFamilies: Family[];
  selectedFamilyIndex: number;
  positions: Positions;
  fontSizes: FontSizes;
  lineHeights: LineHeights;
  addressMaxChars: number;
  postalCodeAdvance: number;
  setPreviousFamilyIndex: () => void;
  setNextFamilyIndex: () => void;
  setPositions: (value: Positions) => void;
  setFontSizes: (value: FontSizes) => void;
  setLineHeights: (value: LineHeights) => void;
  setAddressMaxChars: (value: number) => void;
  setPostalCodeAdvance: (value: number) => void;
}

const PostCardDisplay = ({
  selectedFamilies,
  selectedFamilyIndex,
  positions,
  fontSizes,
  lineHeights,
  addressMaxChars,
  postalCodeAdvance,
  setPreviousFamilyIndex,
  setNextFamilyIndex,
  setPositions,
  setFontSizes,
  setLineHeights,
  setAddressMaxChars,
  setPostalCodeAdvance,
}: PostCardDisplayProps) => {
  const [selectedPart, setSelectedPart] = useState<Part>('name');

  const partItems: { key: Part; label: string }[] = [
    { key: 'name', label: '名前' },
    { key: 'address', label: '住所' },
    { key: 'postalCode', label: '郵便番号' },
  ];

  const changePosition = (e: React.ChangeEvent<HTMLInputElement>, x: boolean) => {
    const newPositions: Positions = { ...positions };
    newPositions[selectedPart][x ? 0 : 1] = parseFloat(e.target.value);
    setPositions(newPositions);
  };

  const changeFontSize = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFontSizes: FontSizes = { ...fontSizes };
    newFontSizes[selectedPart] = parseFloat(e.target.value);
    setFontSizes(newFontSizes);
  };

  const changeLineHeight = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLineHeights: LineHeights = { ...lineHeights };
    newLineHeights[selectedPart] = parseFloat(e.target.value);
    setLineHeights(newLineHeights);
  };

  const changeAddressMaxChars = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddressMaxChars(parseInt(e.target.value));
  };

  const changePostalCodeAdvance = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPostalCodeAdvance(parseFloat(e.target.value));
  };

  return (
    <div>
      <PostCard
        families={selectedFamilies}
        selectedFamilyIndex={selectedFamilyIndex}
        positions={positions}
        fontSizes={fontSizes}
        lineHeights={lineHeights}
        addressMaxChars={addressMaxChars}
        postalCodeAdvance={postalCodeAdvance}
        selectedPart={selectedPart}
        setSelectedPart={setSelectedPart}
      />
      <Navigation>
        <span>
          {selectedFamilyIndex + 1} / {selectedFamilies.length}
        </span>
        <Button type="button" value="前へ" onClick={setPreviousFamilyIndex} />
        <Button type="button" value="次へ" onClick={setNextFamilyIndex} />
      </Navigation>
      <div>
        <SwitchButton<Part>
          items={partItems}
          selectedItem={selectedPart}
          setSelectedItem={setSelectedPart}
        />
        <Details>
          <DetailedLine>
            <LeftLabel>X 座標</LeftLabel>
            <label>
              <Input
                type="number"
                length={4}
                value={positions[selectedPart][0]}
                step={0.25}
                onChange={(e) => changePosition(e, true)}
              />{' '}
              mm
            </label>{' '}
          </DetailedLine>
          <DetailedLine>
            <LeftLabel>Y 座標</LeftLabel>
            <label>
              <Input
                type="number"
                length={4}
                value={positions[selectedPart][1]}
                step={0.25}
                onChange={(e) => changePosition(e, false)}
              />{' '}
              mm
            </label>
          </DetailedLine>
          <DetailedLine>
            <LeftLabel>サイズ</LeftLabel>
            <Input
              type="number"
              length={4}
              value={fontSizes[selectedPart]}
              step={0.25}
              onChange={changeFontSize}
            />{' '}
            mm （{fontSizes[selectedPart] * 4} Q）
          </DetailedLine>
          <DetailedLine>
            <LeftLabel>行送り</LeftLabel>
            <Input
              type="number"
              length={4}
              value={lineHeights[selectedPart]}
              step={0.5}
              onChange={changeLineHeight}
            />{' '}
            mm（{lineHeights[selectedPart] * 4} Q）
          </DetailedLine>
          {selectedPart === 'address' && (
            <DetailedLine>
              <LeftLabel>最大字数</LeftLabel>
              <Input
                type="number"
                length={4}
                value={addressMaxChars}
                onChange={changeAddressMaxChars}
              />
            </DetailedLine>
          )}
          {selectedPart === 'postalCode' && (
            <DetailedLine>
              <LeftLabel>字送り</LeftLabel>
              <Input
                type="number"
                length={4}
                value={postalCodeAdvance}
                step={0.5}
                onChange={changePostalCodeAdvance}
              />{' '}
              mm（{postalCodeAdvance * 4} Q）
            </DetailedLine>
          )}
        </Details>
      </div>
    </div>
  );
};
export default PostCardDisplay;
