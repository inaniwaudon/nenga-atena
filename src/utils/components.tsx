import styled, { css } from 'styled-components';
import { fontFamily, keyColor, subColor } from '../const/style';

const ButtonStyle = css`
  color: #fff;
  height: 14px;
  line-height: 14px;
  font-size: 14px;
  padding: 6px 8px 8px 8px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  box-sizing: content-box;
  background: ${keyColor};

  &:hover {
    background: ${subColor};
  }
`;

export const Button = styled.input`
  ${ButtonStyle}
  font-family: ${fontFamily};
`;

export const ButtonDiv = styled.div`
  ${ButtonStyle}
  display: inline-block;
`;
