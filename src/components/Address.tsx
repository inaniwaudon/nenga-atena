import React from 'react';
import styled from 'styled-components';
import { prefectures } from '../const/prefectures';
import { familyFields, familiesToCsv, Family } from '../utils/data';

const Wrapper = styled.div`
  width: 100%;
  position: relative;
`;

const Tr = styled.tr`
  height: 20px;
  line-height: 20px;
  font-size: 12px;
`;

const Th = styled.th<{ length: number }>`
  width: ${(props) => props.length}em;
`;

const Input = styled.input`
  width: 100%;
  height: 18px;
  font-size: 12px;
  border: none;
  background: transparent;
`;

const CautionTd = styled.td`
  color: #c00;
  font-weight: bold;
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 400px;
`;

interface NavigationProps {
  families: Family[];
  editsCsv: boolean;
  setFamilies: (families: Family[]) => void;
  setCsvData: (csv: string) => void;
  setSelectedFamilyIndex: (index: number) => void;
}

const Address = ({
  families,
  editsCsv,
  setFamilies,
  setCsvData,
  setSelectedFamilyIndex,
}: NavigationProps) => {
  const changeEnabled = (e: React.ChangeEvent<HTMLInputElement>, lineIndex: number) => {
    const newFamilies = [...families];
    newFamilies[lineIndex].enabled = e.target.checked;
    setFamilies(newFamilies);
    if (newFamilies[lineIndex].enabled) {
      setSelectedFamilyIndex(
        newFamilies.slice(0, lineIndex).filter((family) => family.enabled).length,
      );
    }
  };

  const changeTextField = (
    e: React.ChangeEvent<HTMLInputElement>,
    lineIndex: number,
    key: keyof Family,
  ) => {
    const newFamilies = [...families];
    (newFamilies[lineIndex][key] as string) = e.target.value ?? '';
    setFamilies(newFamilies);
    if (newFamilies[lineIndex].enabled) {
      setSelectedFamilyIndex(
        newFamilies.slice(0, lineIndex).filter((family) => family.enabled).length,
      );
    }
  };

  const selectFamily = (lineIndex: number) => {
    if (families[lineIndex].enabled) {
      setSelectedFamilyIndex(
        families.slice(0, lineIndex).filter((family) => family.enabled).length,
      );
    }
  };

  const textFields = familyFields.slice(1).map((field) => field.key);

  return (
    <Wrapper>
      {!editsCsv ? (
        <table>
          <tbody>
            <Tr>
              <Th length={2}>印刷</Th>
              <Th length={5}>氏</Th>
              <Th length={5}>名</Th>
              <Th length={6}>郵便番号</Th>
              <Th length={5}>都道府県</Th>
              <Th length={14}>市区町村</Th>
              <Th length={10}>番地</Th>
              <Th length={20}>建物名等</Th>
              <Th length={5}>連名1</Th>
              <Th length={5}>連名2</Th>
              <Th length={5}>連名3</Th>
            </Tr>
            {families.map((family, index) => {
              const errors: string[] = [];
              // postal code
              if (!/^[0-9]{7}$/.test(family.postalCode)) {
                errors.push('郵便番号は 7 桁の数値で記入してください');
              }
              // prefecture
              if (prefectures.indexOf(family.prefecture) < 0) {
                errors.push('都道府県が不正です');
              }

              return (
                <React.Fragment key={index}>
                  <Tr key={index}>
                    <td>
                      <input
                        type="checkbox"
                        checked={family.enabled}
                        onChange={(e) => changeEnabled(e, index)}
                        onSelect={() => selectFamily(index)}
                      />
                    </td>
                    {textFields.map((field) => (
                      <td key={field}>
                        <Input
                          value={family[field] as string}
                          onChange={(e) => changeTextField(e, index, field)}
                          onSelect={() => selectFamily(index)}
                        />
                      </td>
                    ))}
                  </Tr>
                  {errors.length > 0 && (
                    <Tr>
                      <td></td>
                      <CautionTd colSpan={textFields.length}>{errors.join('、')}</CautionTd>
                    </Tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      ) : (
        <Textarea onChange={(e) => setCsvData(e.target.value)}>{familiesToCsv(families)}</Textarea>
      )}
    </Wrapper>
  );
};

export default Address;
