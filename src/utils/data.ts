export interface Family {
  enabled: boolean;
  familyName: string;
  personalName: string;
  postalCode: string;
  prefecture: string;
  municipalities: string;
  address: string;
  building: string;
  consecutiveName1: string;
  consecutiveName2: string;
  consecutiveName3: string;
}

const familyLabels: { [key in keyof Family]: string } = {
  enabled: '印刷',
  familyName: '姓',
  personalName: '名',
  postalCode: '郵便番号',
  prefecture: '都道府県',
  municipalities: '市区町村',
  address: '番地',
  building: '建物名等',
  consecutiveName1: '連名1',
  consecutiveName2: '連名2',
  consecutiveName3: '連名3',
} as const;

export const readCsv = (csv: string) => {
  const data: Family[] = [];
  const lines = csv.split('\n');
  const headers = lines[0].split(',');
  for (let y = 1; y < lines.length; y++) {
    const bodies = lines[y].split(',');
    const family: { [key in string]: any } = { enabled: false };
    for (let x = 0; x < Math.min(bodies.length, headers.length); x++) {
      const reversedLabels: { [key in string]: string } = Object.entries(familyLabels).reduce(
        (previous, current) => ({ [current[1]]: current[0], ...previous }),
        {},
      );
      if (headers[x] === '印刷' && bodies[x] === 'o') {
        family.enabled = true;
      } else if (headers[x] in reversedLabels) {
        family[reversedLabels[headers[x]]] = bodies[x];
      }
    }
    for (let label in familyLabels) {
      family[label] = family[label] ?? '';
    }
    data.push(family as any as Family);
  }
  return data;
};

export const saveFamiliesToLocalStorage = (families: Family[]) => {
  const json = JSON.stringify(families);
  localStorage.setItem('families', json);
};
