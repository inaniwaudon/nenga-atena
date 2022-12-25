import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import Navigation from './Navigation';
import PostCard from './PostCard';
import { readCsv, saveFamiliesToLocalStorage, Family } from '../utils/data';
import { loadFont } from '../utils/font';

const Page = styled.div`
  margin: 30px;
`;

const Header = styled.header`
  height: 38px;
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
`;

const TopNavigation = styled.nav`
  margin: 6px 0;
`;

const Main = styled.div`
  display: flex;
  gap: 20px;
`;

const H1 = styled.h1`
  font-size: 24px;
  line-height: 24px;
  margin: 0 10px 0 0;
  padding: 6px 0 6px 0;
`;

const PostCardWrapper = styled.div`
  position: sticky;
  left: 0;
`;

const Footer = styled.footer`
  height: 16px;
  line-height: 16px;
  margin-top: 20px;
`;

const App = () => {
  const [families, setFamilies] = useState<Family[]>([]);
  const [selectedFamilyIndex, setSelectedFamilyIndex] = useState(0);

  const readCsvFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length == 0) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0]);
    fileReader.onload = () => {
      if (typeof fileReader.result === 'string') {
        const data = readCsv(fileReader.result);
        setFamilies(data);
        saveFamiliesToLocalStorage(data);
      }
    };
  };

  const normalize = () => {};

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
      <Header>
        <H1>年賀状宛名作成ツール</H1>
        <TopNavigation>
          <label>
            CSV読み込み <input type="file" onChange={readCsvFile} />
          </label>
          <input type="button" value="正規化" onClick={normalize} />
        </TopNavigation>
      </Header>
      <Main>
        <PostCardWrapper>
          <PostCard families={selectedFamilies} selectedFamilyIndex={selectedFamilyIndex} />
          <input type="button" value="前へ" onClick={setPreviousFamilyIndex} />
          <input type="button" value="次へ" onClick={setNextFamilyIndex} />
        </PostCardWrapper>
        <Navigation families={families} />
      </Main>
      <Footer>
        <small>
          This application is released under MIT Liscense. Source code is available on{' '}
          <a href="https://github.com/inaniwaudon/nengajo-atena">GitHub</a>.
        </small>
      </Footer>
    </Page>
  );
};

export default App;
