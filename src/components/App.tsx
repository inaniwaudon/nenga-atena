import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import Header from './Header';
import Address from './Address';
import PostCardDisplay from './PostCardDisplay';
import { fontFamily } from '../const/style';
import { fillFamilies, readCsv, saveFamiliesToLocalStorage, Family } from '../utils/data';
import { outputPdf } from '../utils/draw';
import { FontSizes, LineHeights, Positions } from '../utils/style';

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

const Left = styled.div`
  width: 300px;
`;

const Right = styled.div``;

const Description = styled.div`
  line-height: 1.8;
  color: #666;

  ul {
    padding: 0 20px;
  }
`;

const Pre = styled.pre`
  padding: 2px 10px 2px 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
`;

const Footer = styled.footer`
  line-height: 24px;
  margin-top: 20px;
`;

const App = () => {
  const [families, setFamilies] = useState<Family[]>([]);
  const [selectedFamilyIndex, setSelectedFamilyIndex] = useState(0);
  const [editsCsv, setEditsCsv] = useState(false);
  const [displaysOnlyPrintable, setDisplaysOnlyPrintable] = useState(false);

  // styles
  const [positions, setPositions] = useState<Positions>({
    postalCode: [44, 9],
    address: [88, 25],
    name: [60, 50],
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

  const updateFamilies = (families: Family[]) => {
    setFamilies(fillFamilies(families));
    saveFamiliesToLocalStorage(families);
  };

  const updateCsvData = (csv: string) => {
    const families = readCsv(csv);
    updateFamilies(families);
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
    outputPdf(selectedFamilies, positions, fontSizes, lineHeights, addressMaxChars);
  };

  useEffect(() => {
    const json = localStorage.getItem('families');
    updateFamilies([]);
    if (json) {
      const familyArray = JSON.parse(json);
      if (Array.isArray(familyArray)) {
        updateFamilies(familyArray);
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
        />
      </HeaderWrapper>
      <Main>
        <Left>
          <PostCardDisplay
            selectedFamilies={selectedFamilies}
            selectedFamilyIndex={selectedFamilyIndex}
            positions={positions}
            fontSizes={fontSizes}
            lineHeights={lineHeights}
            addressMaxChars={addressMaxChars}
            setPreviousFamilyIndex={setPreviousFamilyIndex}
            setNextFamilyIndex={setNextFamilyIndex}
            setPositions={setPositions}
            setFontSizes={setFontSizes}
            setLineHeights={setLineHeights}
            setAddressMaxChars={setAddressMaxChars}
          />
        </Left>
        <Right>
          <Address
            families={families}
            editsCsv={editsCsv}
            displaysOnlyPrintable={displaysOnlyPrintable}
            updateFamilies={updateFamilies}
            updateCsvData={updateCsvData}
            setSelectedFamilyIndex={setSelectedFamilyIndex}
          />
          <Description>
            <ul>
              <li>
                宛名データを入力するか、｢CSV を開く」からCSVデータを開いて、住所録を作成しましょう。
                <br />
                読み込み可能な CSV データは以下の通りです。
                <code>
                  <Pre>
                    印刷,姓,名,郵便番号,都道府県,市区町村,番地,建物名等,連名1,連名2,連名3{'\n'}
                    o,年賀状,太郎,1008111,東京都,千代田区千代田,1-1,,花子,次郎,三郎
                  </Pre>
                </code>
              </li>
              <li>行にデータを入力することに新たな行が追加されます。空行は自動で削除されます。</li>
              <li>
                入力した住所録は自動保存されます。データはローカルにのみ保存され、サーバーには送信されません。
              </li>
              <li>
                最左の「印刷」列にチェックを付けると、出力の対象に含まれます。左側のプレビューからも確認できます。
              </li>
              <li>
                ｢PDF を出力」を押すと、宛名の組版結果を PDF
                に出力します。処理には時間が掛かる場合があります。
              </li>
              <li>左側のプレビュー画像を右クリックすると、宛名画像を一枚ずつ保存できます。</li>
            </ul>
          </Description>
          <Footer>
            <small>
              Copyright (c) 2022 いなにわうどん. This software is released under{' '}
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
