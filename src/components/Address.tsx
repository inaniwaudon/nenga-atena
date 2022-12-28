import React from 'react';
import styled from 'styled-components';
import { Core as YubinBangoCore } from 'yubinbango-core2';
import { prefectures } from '../const/prefectures';
import { fontFamily } from '../const/style';
import { familyFields, familiesToCsv, isEmptyFamily, Family } from '../utils/family';

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
  font-family: ${fontFamily};
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
  font-family: ${fontFamily};
`;

interface NavigationProps {
  families: Family[];
  editsCsv: boolean;
  displaysOnlyPrintable: boolean;
  updateFamilies: (families: Family[]) => void;
  updateCsvData: (csv: string) => void;
  setSelectedFamilyIndex: (index: number) => void;
}

const Address = ({
  families,
  editsCsv,
  displaysOnlyPrintable,
  updateFamilies,
  updateCsvData,
  setSelectedFamilyIndex,
}: NavigationProps) => {
  const changeEnabled = (e: React.ChangeEvent<HTMLInputElement>, lineIndex: number) => {
    const newFamilies = [...families];
    newFamilies[lineIndex].enabled = e.target.checked;
    updateFamilies(newFamilies);
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
    updateFamilies(newFamilies);
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

  const predictPostalCode = (postalCode: string, lineIndex: number) => {
    if (postalCode.length !== 7) {
      return;
    }
    new YubinBangoCore(postalCode, (address: any) => {
      if (address.region.length > 0 && address.locality.length > 0) {
        const newFamilies = [...families];
        newFamilies[lineIndex].prefecture = address.region;
        newFamilies[lineIndex].municipalities = address.locality + address.street;
        updateFamilies(newFamilies);
      }
    });
  };

  const textFields = familyFields.slice(1).map((field) => field.key);
  const displayingFamilies = families.filter(
    (family, index) => family.enabled || !displaysOnlyPrintable || index === families.length - 1,
  );

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
            {displayingFamilies.map((family, lineIndex) => {
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
                <React.Fragment key={lineIndex}>
                  <Tr key={lineIndex}>
                    <td>
                      <input
                        type="checkbox"
                        checked={family.enabled}
                        onChange={(e) => changeEnabled(e, lineIndex)}
                        onSelect={() => selectFamily(lineIndex)}
                      />
                    </td>
                    {textFields.map((field, index) => (
                      <td key={field}>
                        <Input
                          value={family[field] as string}
                          onChange={(e) => {
                            changeTextField(e, lineIndex, field);
                            if (field === 'postalCode') {
                              predictPostalCode(e.target.value, lineIndex);
                            }
                          }}
                          onSelect={() => selectFamily(lineIndex)}
                        />
                      </td>
                    ))}
                  </Tr>
                  {errors.length > 0 && !isEmptyFamily(family) && (
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
        <Textarea onChange={(e) => updateCsvData(e.target.value)}>
          {familiesToCsv(families)}
        </Textarea>
      )}
    </Wrapper>
  );
};

export default Address;
