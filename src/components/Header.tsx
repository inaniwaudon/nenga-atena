import React from 'react';
import styled from 'styled-components';
import { Button, ButtonDiv, CautionButton } from '../utils/components';

const Wrapper = styled.header`
  padding: 24px 30px 10px 30px;
  display: inline-flex;
  gap: 10px;
`;

const H1 = styled.h1`
  font-size: 20px;
  line-height: 20px;
  margin: 0 10px 0 0;
  padding: 0;
`;

const Navigation = styled.nav`
  margin: -1px 0;
  display: inline-flex;
  justify-content: start;
  gap: 10px;
`;

const ButtonLabel = styled.label`
  margin-top: -3px;
`;

const FileInput = styled.input`
  display: none;
`;

interface HeaderProps {
  editsCsv: boolean;
  displaysOnlyPrintable: boolean;
  updateCsvData: (text: string) => void;
  setEditsCsv: (value: boolean) => void;
  setDisplaysOnlyPrintable: (value: boolean) => void;
  outputPdf: () => void;
}

export const Header = ({
  editsCsv,
  displaysOnlyPrintable,
  updateCsvData,
  setEditsCsv,
  setDisplaysOnlyPrintable,
  outputPdf,
}: HeaderProps) => {
  const changeEditsCsv = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditsCsv(e.target.checked);
  };

  const changeDisplaysOnlyPrintable = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplaysOnlyPrintable(e.target.checked);
  };

  const readCsvFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length == 0) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0]);
    fileReader.onload = () => {
      if (typeof fileReader.result === 'string') {
        updateCsvData(fileReader.result);
      }
    };
  };

  const removeAllAddresses = () => {
    const result = confirm('本当に住所録を削除しますか？');
    if (result) {
      updateCsvData('');
    }
  };

  return (
    <Wrapper>
      <H1>年賀状宛名作成ツール</H1>
      <Navigation>
        <ButtonLabel>
          <ButtonDiv>CSV を開く</ButtonDiv>
          <FileInput type="file" onChange={readCsvFile} />
        </ButtonLabel>
        <ButtonLabel>
          <Button type="button" value="PDF へ出力" onClick={outputPdf} />
        </ButtonLabel>
        <ButtonLabel>
          <CautionButton type="button" value="住所録を削除" onClick={removeAllAddresses} />
        </ButtonLabel>
        <label>
          <input type="checkbox" onChange={changeEditsCsv} />
          CSV を直接編集
        </label>
        <label>
          <input type="checkbox" onChange={changeDisplaysOnlyPrintable} />
          印刷行のみ表示
        </label>
      </Navigation>
    </Wrapper>
  );
};

export default Header;
