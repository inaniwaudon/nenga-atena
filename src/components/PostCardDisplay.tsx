import React, { useState } from 'react';
import styled from 'styled-components';
import PostCard from './PostCard';
import { keyColor } from '../const/style';
import { Family } from '../utils/data';
import { Button, InputBox } from '../utils/components';
import { Part, FontSizes, LineHeights, Positions } from '../utils/style';

const Navigation = styled.nav`
  margin: 10px 0 10px 0;
  display: flex;
  justify-content: right;
  gap: 10px;
`;

const PartListItem = styled.li<{ selected: boolean }>`
  line-height: 15px;
  color: ${(props) => (props.selected ? '#fff' : keyColor)};
  font-size: 15px;
  padding: 4px 10px 6px 10px;
  background: ${(props) => (props.selected ? keyColor : '#fff')};
`;

const PartList = styled.ul`
  margin: 0 0 6px 0;
  padding: 0;
  border: solid 1px ${keyColor};
  border-radius: 4px;
  list-style: none;
  display: inline-flex;
  overflow: hidden;

  ${PartListItem} + ${PartListItem} {
    border-left: solid 1px #ccc;
  }
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
  setPreviousFamilyIndex: () => void;
  setNextFamilyIndex: () => void;
  setPositions: (value: Positions) => void;
  setFontSizes: (value: FontSizes) => void;
  setLineHeights: (value: LineHeights) => void;
  setAddressMaxChars: (value: number) => void;
}

const PostCardDisplay = ({
  selectedFamilies,
  selectedFamilyIndex,
  positions,
  fontSizes,
  lineHeights,
  addressMaxChars,
  setPreviousFamilyIndex,
  setNextFamilyIndex,
  setPositions,
  setFontSizes,
  setLineHeights,
  setAddressMaxChars,
}: PostCardDisplayProps) => {
  const [selectedPart, setSelectedPart] = useState<Part>('name');

  const partLabel: { part: Part; label: string }[] = [
    { part: 'name', label: '名前' },
    { part: 'address', label: '住所' },
    { part: 'postalCode', label: '郵便番号' },
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
    setAddressMaxChars(parseFloat(e.target.value));
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
        <PartList>
          {partLabel.map(({ part, label }) => (
            <PartListItem
              selected={selectedPart === part}
              key={part}
              onClick={() => setSelectedPart(part)}
            >
              {label}
            </PartListItem>
          ))}
        </PartList>
        <Details>
          <DetailedLine>
            <LeftLabel>X 座標</LeftLabel>
            <label>
              <Input
                type="number"
                length={4}
                value={positions[selectedPart][0]}
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
        </Details>
      </div>
    </div>
  );
};
export default PostCardDisplay;
