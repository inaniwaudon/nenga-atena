import React from 'react';
import styled from 'styled-components';
import { Button, ButtonDiv } from '../utils/components';

const Wrapper = styled.header`
  height: 20px;
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
`;

const H1 = styled.h1`
  font-size: 20px;
  line-height: 20px;
  margin: 0;
  padding: 0;
`;

const Navigation = styled.nav`
  font-size: 14px;
  margin: -1px 0;
  display: flex;
  gap: 10px;
`;

const ButtonWrapper = styled.span`
  margin-right: 4px;
`;

const FileInput = styled.input`
  display: none;
`;

interface HeaderProps {
  editsCsv: boolean;
  setCsvData: (text: string) => void;
  setEditsCsv: (value: boolean) => void;
}

export const Header = ({ editsCsv, setCsvData, setEditsCsv }: HeaderProps) => {
  const switchCsvView = () => {
    setEditsCsv(!editsCsv);
  };

  const readCsvFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length == 0) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0]);
    fileReader.onload = () => {
      if (typeof fileReader.result === 'string') {
        setCsvData(fileReader.result);
      }
    };
  };

  return (
    <Wrapper>
      <H1>年賀状宛名作成ツール</H1>
      <Navigation>
        <label>
          <ButtonDiv>CSV 読み込み</ButtonDiv>
          <FileInput type="file" onChange={readCsvFile} />
        </label>
        <Button
          type="button"
          onClick={switchCsvView}
          value={editsCsv ? '表形式で編集する' : 'CSV を直接編集'}
        />
        <Button
          type="button"
          onClick={switchCsvView}
          value={editsCsv ? '印刷箇所のみ表示' : '印刷箇所のみ表示'}
        />
        データは自動保存されます
      </Navigation>
    </Wrapper>
  );
};

export default Header;
