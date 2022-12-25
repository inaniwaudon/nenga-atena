import React from 'react';
import styled from 'styled-components';
import { Family } from '../utils/data';

const Tr = styled.tr`
  height: 20px;
  font-size: 12px;
`;

const EnableTh = styled.th`
  width: 2em;
`;

const AddressTh = styled.th`
  width: 20em;
`;

const Th = styled.th<{ length: number }>`
  width: ${(props) => props.length}em;
`;

interface NavigationProps {
  families: Family[];
}

const Navigation = ({ families }: NavigationProps) => {
  return (
    <table>
      <tbody>
        <Tr>
          <EnableTh>印刷</EnableTh>
          <Th length={5}>氏</Th>
          <Th length={5}>名</Th>
          <Th length={6}>郵便番号</Th>
          <Th length={5}>都道府県</Th>
          <Th length={14}>市区町村</Th>
          <Th length={10}>番地</Th>
          <Th length={20}>建物名等</Th>
          <Th length={5}>連名1</Th>
          <Th length={5}>連名2</Th>
        </Tr>
        {families.map((family, index) => (
          <Tr key={index}>
            <td>
              <input type="checkbox" checked={family.enabled} />
            </td>
            <td contentEditable>{family.familyName}</td>
            <td contentEditable>{family.personalName}</td>
            <td contentEditable>{family.postalCode}</td>
            <td contentEditable>{family.prefecture}</td>
            <td contentEditable>{family.municipalities}</td>
            <td contentEditable>{family.address}</td>
            <td contentEditable>{family.building}</td>
            <td contentEditable>{family.consecutiveName1}</td>
            <td contentEditable>{family.consecutiveName2}</td>
          </Tr>
        ))}
      </tbody>
    </table>
  );
};

export default Navigation;
