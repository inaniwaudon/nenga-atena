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

export const familyFields: { key: keyof Family; label: string }[] = [
  { key: 'enabled', label: '印刷' },
  { key: 'familyName', label: '姓' },
  { key: 'personalName', label: '名' },
  { key: 'postalCode', label: '郵便番号' },
  { key: 'prefecture', label: '都道府県' },
  { key: 'municipalities', label: '市区町村' },
  { key: 'address', label: '番地' },
  { key: 'building', label: '建物名等' },
  { key: 'consecutiveName1', label: '連名1' },
  { key: 'consecutiveName2', label: '連名2' },
  { key: 'consecutiveName3', label: '連名3' },
];

export const readCsv = (csv: string) => {
  const data: Family[] = [];
  const lines = csv.split('\n');
  const headers = lines[0].split(',');
  const reversedLabels: { [key in string]: string } = familyFields.reduce(
    (previous, current) => ({ [current.label]: current.key, ...previous }),
    {},
  );

  for (let y = 1; y < lines.length; y++) {
    const bodies = lines[y].split(',');
    const family: { [key in string]: any } = { enabled: false };
    for (let x = 0; x < Math.min(bodies.length, headers.length); x++) {
      if (headers[x] === '印刷') {
        family.enabled = bodies[x] === 'o';
      } else if (headers[x] in reversedLabels) {
        family[reversedLabels[headers[x]]] = bodies[x];
      }
    }
    for (let { key } of familyFields) {
      if (!(key in family)) {
        family[key] = '';
      }
    }
    data.push(family as any as Family);
  }
  return data;
};

export const familiesToCsv = (families: Family[]) => {
  const delimiter = ',';
  const header = familyFields.map((item) => item.label).join(delimiter);
  const body = families.map((family) =>
    familyFields.map(({ key }) =>
      key === 'enabled'
        ? family.enabled
          ? 'o'
          : 'x'
        : key in family
        ? (family as { [key in string]: any })[key]
        : '',
    ),
  );
  return [header, ...body].join('\n');
};

export const saveCsv = (families: Family[]) => {
  const blob = new Blob([familiesToCsv(families)], { type: 'text/csv' }); //配列に上記の文字列(str)を設定
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'address.csv';
  link.click();
};

export const saveFamiliesToLocalStorage = (families: Family[]) => {
  const json = JSON.stringify(families);
  localStorage.setItem('families', json);
};

export const consistentAddress = (address: string) => {
  return address
    .replace(/[A-Za-z0-9]/g, (s) => String.fromCharCode(s.charCodeAt(0) + 0xfee0))
    .replace(/-/g, '―');
};

export const isEmptyFamily = (family: Family) =>
  !family.enabled &&
  family.familyName.length === 0 &&
  family.personalName.length === 0 &&
  family.postalCode.length === 0 &&
  family.prefecture.length === 0 &&
  family.municipalities.length === 0 &&
  family.address.length === 0 &&
  family.building.length === 0 &&
  family.consecutiveName1.length === 0 &&
  family.consecutiveName2.length === 0 &&
  family.consecutiveName3.length === 0;

export const fillFamilies = (families: Family[]) => {
  const filteredFamilies = families.filter((family) => !isEmptyFamily(family));
  const newFamily = [...new Array(1)].map<Family>(() => ({
    enabled: false,
    familyName: '',
    personalName: '',
    postalCode: '',
    prefecture: '',
    municipalities: '',
    address: '',
    building: '',
    consecutiveName1: '',
    consecutiveName2: '',
    consecutiveName3: '',
  }));
  return [...filteredFamilies, ...newFamily];
};
