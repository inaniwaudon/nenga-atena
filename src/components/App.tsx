import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import Description from './Description';
import Header from './Header';
import Address from './Address';
import Left from './Left';
import { fontFamily } from '../const/style';
import {
  fillFamilies,
  readCsv,
  saveCsv,
  saveFamiliesToLocalStorage,
  Family,
} from '../utils/family';
import { outputPdf } from '../utils/draw';
import { saveStylesToLocalStorage, FontSizes, LineHeights, Positions } from '../utils/style';

const Page = styled.div`
  font-size: 14px;
  font-family: ${fontFamily};
`;

const HeaderWrapper = styled.div`
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 2;
`;

const Main = styled.main`
  margin: 10px 30px 30px 30px;
  display: flex;
  gap: 30px;
`;

const LeftWrapper = styled.div`
  width: 300px;
`;

const Right = styled.div``;

const DescriptionWrapper = styled.div`
  margin-top: 30px;
`;

const Footer = styled.footer`
  line-height: 24px;
  margin-top: 30px;
`;

const App = () => {
  const [families, setFamilies] = useState<Family[]>([]);
  const [selectedFamilyIndex, setSelectedFamilyIndex] = useState(0);
  const [editsCsv, setEditsCsv] = useState(false);
  const [displaysOnlyPrintable, setDisplaysOnlyPrintable] = useState(false);

  // styles
  const [positions, setPositions] = useState<Positions>({
    postalCode: [45, 11.75],
    address: [90, 30],
    name: [62, 48],
  });
  const [fontSizes, setFontSizes] = useState<FontSizes>({
    postalCode: 8,
    address: 5,
    name: 10,
  });
  const [lineHeights, setLineHeights] = useState<LineHeights>({
    postalCode: 8,
    address: 7,
    name: 13,
  });
  const [addressMaxChars, setAddressMaxChars] = useState<number>(12);
  const [postalCodeAdvance, setPostalCodeAdvance] = useState<number>(7);

  const updatePositions = (value: Positions) => {
    setPositions(value);
    saveStylesToLocalStorage(value, fontSizes, lineHeights, addressMaxChars, postalCodeAdvance);
  };

  const updateFontSizes = (value: FontSizes) => {
    setFontSizes(value);
    saveStylesToLocalStorage(positions, value, lineHeights, addressMaxChars, postalCodeAdvance);
  };

  const updateLineHeights = (value: LineHeights) => {
    setLineHeights(value);
    saveStylesToLocalStorage(positions, fontSizes, value, addressMaxChars, postalCodeAdvance);
  };

  const updateAddressMaxChars = (value: number) => {
    setAddressMaxChars(value);
    saveStylesToLocalStorage(positions, fontSizes, lineHeights, value, postalCodeAdvance);
  };

  const updatePostalCodeAdvance = (value: number) => {
    setPostalCodeAdvance(value);
    saveStylesToLocalStorage(positions, fontSizes, lineHeights, addressMaxChars, value);
  };

  // family
  const updateFamilies = (families: Family[]) => {
    setFamilies(fillFamilies(families));
    saveFamiliesToLocalStorage(families);
  };

  const updateCsvData = (csv: string) => {
    const families = readCsv(csv);
    updateFamilies(families);
  };

  const saveCsvWrapper = () => {
    saveCsv(families);
  };

  const selectedFamilies = useMemo(() => families.filter((family) => family.enabled), [families]);

  const setPreviousFamilyIndex = () => {
    setSelectedFamilyIndex(
      selectedFamilyIndex > 0 ? selectedFamilyIndex - 1 : selectedFamilies.length - 1,
    );
  };

  const setNextFamilyIndex = () => {
    setSelectedFamilyIndex(
      selectedFamilyIndex + 1 < selectedFamilies.length ? selectedFamilyIndex + 1 : 0,
    );
  };

  const outputPdfWrapper = () => {
    outputPdf(
      selectedFamilies,
      positions,
      fontSizes,
      lineHeights,
      addressMaxChars,
      postalCodeAdvance,
    );
  };

  // restore
  useEffect(() => {
    const familiesJson = localStorage.getItem('families');
    updateFamilies([]);
    if (familiesJson) {
      const familyArray = JSON.parse(familiesJson);
      if (Array.isArray(familyArray)) {
        updateFamilies(familyArray);
      }
    }

    const stylesJson = localStorage.getItem('styles');
    if (stylesJson) {
      const styles = JSON.parse(stylesJson);
      if (
        ['positions', 'fontSizes', 'lineHeights', 'addressMaxChars', 'postalCodeAdvance'].every(
          (key) => key in styles,
        )
      ) {
        setPositions(styles.positions);
        setFontSizes(styles.fontSizes);
        setLineHeights(styles.lineHeights);
        setAddressMaxChars(styles.addressMaxChars);
        setPostalCodeAdvance(styles.postalCodeAdvance);
      }
    }
  }, []);

  return (
    <Page>
      <HeaderWrapper>
        <Header
          editsCsv={editsCsv}
          displaysOnlyPrintable={displaysOnlyPrintable}
          updateCsvData={updateCsvData}
          setEditsCsv={setEditsCsv}
          setDisplaysOnlyPrintable={setDisplaysOnlyPrintable}
          outputPdf={outputPdfWrapper}
          saveCsv={saveCsvWrapper}
        />
      </HeaderWrapper>
      <Main>
        <LeftWrapper>
          <Left
            selectedFamilies={selectedFamilies}
            selectedFamilyIndex={selectedFamilyIndex}
            positions={positions}
            fontSizes={fontSizes}
            lineHeights={lineHeights}
            addressMaxChars={addressMaxChars}
            postalCodeAdvance={postalCodeAdvance}
            setPreviousFamilyIndex={setPreviousFamilyIndex}
            setNextFamilyIndex={setNextFamilyIndex}
            setPositions={updatePositions}
            setFontSizes={updateFontSizes}
            setLineHeights={updateLineHeights}
            setAddressMaxChars={updateAddressMaxChars}
            setPostalCodeAdvance={updatePostalCodeAdvance}
          />
        </LeftWrapper>
        <Right>
          <Address
            families={families}
            editsCsv={editsCsv}
            displaysOnlyPrintable={displaysOnlyPrintable}
            updateFamilies={updateFamilies}
            updateCsvData={updateCsvData}
            setSelectedFamilyIndex={setSelectedFamilyIndex}
          />
          <DescriptionWrapper>
            <Description />
          </DescriptionWrapper>
          <Footer>
            <small>
              Copyright (c) 2022–2023 いなにわうどん. This software is released under{' '}
              <a href="https://opensource.org/licenses/mit-license.php">the MIT Liscense</a>. The
              source code is available on{' '}
              <a href="https://github.com/inaniwaudon/nengajo-atena">GitHub</a>.
            </small>
          </Footer>
        </Right>
      </Main>
    </Page>
  );
};

export default App;
