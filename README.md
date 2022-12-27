# nenga-atena

年賀状の表面（宛名面）を Web 上で生成するツールです。

## 書き出し

以下の形式に対応しています。縦書きの表記にも対応しています。

- PNG 画像（一枚ずつ）
- PDF（連番、画像埋め込み形式で）形式の画像として書き出します。

## 使用方法

1. https://inaniwaudon.github.io/nengajo-atena/ にアクセスします。

2. **データの読み込み**  
CSV 形式の住所録を読み込みます。この際、CSV データは以下の形式を取る必要があります。先頭 1 行はヘッダーとして扱われ、列の順序は問いません。過不足がある列は無視されます。

```csv
印刷,姓,名,郵便番号,都道府県,市区町村,番地,建物名等,連名1,連名2,連名3
o,年賀状,太郎,1008111,東京都,千代田区千代田,1-1,,花子,次郎,三郎
```

3. **住所録の編集**  
住所録を編集する際は、表を直接編集するか、｢CSV を直接編集」ボタンを押して CSV 形式で編集します。読込／編集したデータはローカルに自動保存されます。

4. **スタイルの調整**  
左側の入力欄から、各テキストの位置・フォントサイズ・行送り・フォント等を調節します。

5. **書き出し**  
はがきの欄を押して書き出します。

## Future works

- 画像の一括書き出し
- PDF 形式での書き出し

## ライセンス

MIT ライセンスに従って自由に使用・改変・再配布等を行えます。  
Copyright (c) 2022 いなにわうどん.
This software is released under [the MIT Liscense](https://opensource.org/licenses/mit-license.php).

本ソフトウェアでは表示フォントに「[しっぽり明朝](https://fontdasu.com/shippori-mincho/)」を使用しています。
Licensed under SIL Open Font License 1.1 (http://scripts.sil.org/OFL)
© 2022 The Shippori Min Project Authors All rights reserved.
