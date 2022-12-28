import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  line-height: 1.8;
  color: #666;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const H2 = styled.h2`
  line-height: 20px;
  font-size: 20px;
  margin: 0;
`;

const Ul = styled.ul`
  margin: 10px 0 0 0;
  padding: 0 0 0 24px;
`;

const Pre = styled.pre`
  padding: 2px 10px 2px 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
`;

const Description = () => (
  <Wrapper>
    <section>
      <H2>住所録の編集</H2>
      <Ul>
        <li>
          宛名データを入力するか、｢CSV を開く」からCSVデータを開いて、住所録を作成しましょう。
          <br />
          読み込み可能な CSV 形式は以下の通りです。
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
        <li>｢CSV を保存」を押すと、作成した住所録を CSV 形式で保存します。</li>
      </Ul>
    </section>
    <section>
      <H2>宛名面の出力</H2>
      <Ul>
        <li>
          最左の「印刷」列にチェックを付けると、出力の対象に含まれます。左側のプレビューからも確認できます。
        </li>
        <li>
          ｢PDF を出力」を押すと、宛名の組版結果を PDF
          に出力します。処理には時間が掛かる場合があります。
        </li>
        <li>
          左側のプレビュー画像を右クリックすると、宛名画像（PNG 形式）を一枚ずつ保存できます。
        </li>
      </Ul>
    </section>
  </Wrapper>
);
export default Description;
