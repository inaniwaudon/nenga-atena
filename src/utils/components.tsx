import styled, { css } from 'styled-components';
import {
  cautionColor,
  cautionHoverColor,
  fontFamily,
  keyColor,
  keyHoverColor,
} from '../const/style';

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
    background: ${keyHoverColor};
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

export const CautionButton = styled(Button)`
  background: ${cautionColor};

  &:hover {
    background: ${cautionHoverColor};
  }
`;

export const InputBox = styled.input`
  font-family: ${fontFamily};
  padding: 1px 4px 2px 4px;
  border: solid 1px #999;
  border-radius: 3px;
`;
