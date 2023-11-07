import React, { useState } from 'react';
import styled from 'styled-components';
import PostCard from './PostCard';
import PostCardSettings from './PostCardSettings';
import { Family } from '../utils/family';
import { Button } from '../utils/components';
import { Part, FontSizes, LineHeights, Positions } from '../utils/style';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Navigation = styled.nav`
  display: flex;
  justify-content: right;
  align-items: center;
  gap: 10px;
`;

const Index = styled.div`
  line-height: 1;
`;

interface LeftProps {
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

const Left = ({
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
}: LeftProps) => {
  const [selectedPart, setSelectedPart] = useState<Part>('name');

  return (
    <Wrapper>
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
        <Index>
          {selectedFamilyIndex + 1} / {selectedFamilies.length}
        </Index>
        <Button type="button" value="前へ" onClick={setPreviousFamilyIndex} />
        <Button type="button" value="次へ" onClick={setNextFamilyIndex} />
      </Navigation>
      <PostCardSettings
        selectedPart={selectedPart}
        positions={positions}
        fontSizes={fontSizes}
        lineHeights={lineHeights}
        addressMaxChars={addressMaxChars}
        postalCodeAdvance={postalCodeAdvance}
        setSelectedPart={setSelectedPart}
        setPositions={setPositions}
        setFontSizes={setFontSizes}
        setLineHeights={setLineHeights}
        setAddressMaxChars={setAddressMaxChars}
        setPostalCodeAdvance={setPostalCodeAdvance}
      />
    </Wrapper>
  );
};

export default Left;
