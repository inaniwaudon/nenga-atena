import React, { useState } from 'react';
import styled from 'styled-components';
import PostCard from './PostCard';
import { Family } from '../utils/data';
import { Button } from '../utils/components';
import { Part, FontSizes, LineHeights, Positions } from '../utils/style';

const Navigation = styled.nav`
  margin: 10px 0 10px 0;
  display: flex;
  justify-content: right;
  gap: 10px;
`;

const PartListItem = styled.li<{ selected: boolean }>`
  line-height: 15px;
  font-size: 15px;
  font-weight: ${(props) => (props.selected ? 'bold' : 'normal')};
  padding: 4px 10px 6px 10px;
  background: ${(props) => (props.selected ? '#ddd' : '#fff')};
`;

const PartList = styled.ul`
  margin: 0 0 4px 0;
  padding: 0;
  border: solid 1px #999;
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

const Input = styled.input<{ length: number }>`
  width: ${(props) => props.length}em;
`;

interface PostCardDisplayProps {
  selectedFamilies: Family[];
  selectedFamilyIndex: number;
  setPreviousFamilyIndex: () => void;
  setNextFamilyIndex: () => void;
}

const PostCardDisplay = ({
  selectedFamilies,
  selectedFamilyIndex,
  setPreviousFamilyIndex,
  setNextFamilyIndex,
}: PostCardDisplayProps) => {
  const [selectedPart, setSelectedPart] = useState<Part>('name');

  const [positions, setPositions] = useState<Positions>({
    postalCode: [44, 9],
    address: [86, 28],
    name: [60, 50],
  });
  const [fontSizes, setFontSizes] = useState<FontSizes>({
    postalCode: 8,
    address: 5,
    name: 10,
  });
  const [lineHeights, setLineHeights] = useState<LineHeights>({
    postalCode: 8,
    address: 6,
    name: 13,
  });

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

  return (
    <div>
      <PostCard
        families={selectedFamilies}
        selectedFamilyIndex={selectedFamilyIndex}
        positions={positions}
        fontSizes={fontSizes}
        lineHeights={lineHeights}
        selectedPart={selectedPart}
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
            <LeftLabel>位置</LeftLabel>
            <label>
              x:{' '}
              <Input
                type="number"
                length={4}
                value={positions[selectedPart][0]}
                onChange={(e) => changePosition(e, true)}
              />{' '}
              mm
            </label>{' '}
            <label>
              y:{' '}
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
              onChange={changeLineHeight}
            />{' '}
            mm（{lineHeights[selectedPart] * 4} Q）
          </DetailedLine>
          <DetailedLine>
            <LeftLabel>フォント</LeftLabel>
            <Input type="text" length={4} />
          </DetailedLine>
        </Details>
      </div>
    </div>
  );
};
export default PostCardDisplay;
