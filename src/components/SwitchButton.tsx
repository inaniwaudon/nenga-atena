import React from 'react';
import styled from 'styled-components';
import { keyColor } from '../const/style';

const PartListItem = styled.li<{ selected: boolean }>`
  line-height: 15px;
  color: ${(props) => (props.selected ? '#fff' : keyColor)};
  font-size: 15px;
  padding: 5px 10px 7px 10px;
  cursor: pointer;
  background: ${(props) => (props.selected ? keyColor : '#fff')};
`;

const PartList = styled.ul`
  margin: 0 0 6px 0;
  padding: 0;
  border: solid 1px ${keyColor};
  border-radius: 4px;
  list-style: none;
  display: inline-flex;
  overflow: hidden;

  ${PartListItem} + ${PartListItem} {
    border-left: solid 1px #ccc;
  }
`;

interface SwitchButtonProps<T> {
  items: { key: T; label: string }[];
  selectedItem: T;
  setSelectedItem: (key: T) => void;
}

const SwitchButton = <T,>({ items, selectedItem, setSelectedItem }: SwitchButtonProps<T>) => (
  <PartList>
    {items.map(({ key, label }) => (
      <PartListItem
        selected={selectedItem === key}
        key={label}
        onClick={() => setSelectedItem(key)}
      >
        {label}
      </PartListItem>
    ))}
  </PartList>
);

export default SwitchButton;
