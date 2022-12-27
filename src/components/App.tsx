import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import Header from './Header';
import Address from './Address';
import PostCardDisplay from './PostCardDisplay';
import { fontFamily } from '../const/style';
import { readCsv, saveFamiliesToLocalStorage, Family } from '../utils/data';

const Page = styled.div`
  font-family: ${fontFamily};
  margin: 30px;
  display: flex;
  gap: 30px;
`;

const Left = styled.div`
  width: 300px;
`;

const Right = styled.div``;

const Footer = styled.footer`
  line-height: 24px;
  margin-top: 20px;
`;

const App = () => {
  const [families, setFamilies] = useState<Family[]>([]);
  const [selectedFamilyIndex, setSelectedFamilyIndex] = useState(0);
  const [editsCsv, setEditsCsv] = useState(false);

  const setCsvData = (csv: string) => {
    const data = readCsv(csv);
    setFamilies(data);
    saveFamiliesToLocalStorage(data);
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

  useEffect(() => {
    const json = localStorage.getItem('families');
    if (json) {
      const familyArray = JSON.parse(json);
      if (Array.isArray(familyArray)) {
        setFamilies(familyArray);
      }
    }
  }, []);

  return (
    <Page>
      <Left>
        <PostCardDisplay
          selectedFamilies={selectedFamilies}
          selectedFamilyIndex={selectedFamilyIndex}
          setPreviousFamilyIndex={setPreviousFamilyIndex}
          setNextFamilyIndex={setNextFamilyIndex}
        />
      </Left>
      <Right>
        <Header editsCsv={editsCsv} setCsvData={setCsvData} setEditsCsv={setEditsCsv} />
        <Address
          families={families}
          editsCsv={editsCsv}
          setFamilies={setFamilies}
          setCsvData={setCsvData}
          setSelectedFamilyIndex={setSelectedFamilyIndex}
        />
        <Footer>
          <small>入力された住所録はローカルにのみ保存され、サーバーには送信されません。</small>
          <br />
          <small>
            Copyright (c) 2022 いなにわうどん. This software is released under{' '}
            <a href="https://opensource.org/licenses/mit-license.php">the MIT Liscense</a>. The
            source code is available on{' '}
            <a href="https://github.com/inaniwaudon/nengajo-atena">GitHub</a>.
          </small>
        </Footer>
      </Right>
    </Page>
  );
};

export default App;
