function csvStrHandler(str) {
  let value = str.toString();

  if (str instanceof Date) {
    value = str.toLocaleString();
  }

  let tempStr = value.replace(/"/g, '""');

  if (tempStr.search(/("|,|\n)/g) >= 0) {
    tempStr = `"${tempStr}"`;
  }

  return tempStr;
}

function ConvertToCSV(array) {
  const str = array.reduce((a, c, i) => {
    const line = Object.keys(c).reduce((a1, c1) => {
      const temp = a1 !== '' ? `${a1},` : a1;
      const cs = csvStrHandler(c[c1]);
      return `${temp}${cs}`;
    }, '');

    const res = `${a}${line}`;

    return array.length - 1 !== i ? `${res}\r\n` : res;
  }, '');

  return str;
}

export default function ExportCSVFile(fileTitle, items, header) {
  let parsedHeader = header || Object.keys(items[0]);

  parsedHeader = Array.isArray(parsedHeader)
    ? parsedHeader.reduce((a, c) => {
      const temp = a;
      temp[c] = c;
      return temp;
    }, {})
    : Object.keys(parsedHeader).reduce((a, c) => {
        const temp = a;

        // 欄位名稱為 intermediate_stations 就拆分為 中間站 1~12
        if (c === 'intermediate_stations') {
          for (let i = 0, len = 12; i < len; i++) {
            temp[`${c}_${i + 1}`] = `${parsedHeader[c]}_${i + 1}`;
          }
          return temp;
        }

        temp[c] = parsedHeader[c];
        return temp;
      }, {});

  const parsedItems = typeof parsedHeader === 'object'
    ? items.map((item) => {
      const $item = item;

      // true/false 轉 0/1，intermediate_stations null 轉空陣列
      Object.keys($item).forEach((i) => {
        if ($item[i]) {
          if ($item[i] === 'true' || $item[i] === 'false') {
            $item[i] = $item[i] === 'false' ? '0' : '1';
          }
        } else if (i === 'intermediate_stations' && $item[i] == null) {
          $item[i] = '[]';
        } else {
          $item[i] = '';
        }
      });

      // 欄位為 intermediate_stations 開頭就組合值
      if ($item.intermediate_stations) {
        const stations = JSON.parse($item.intermediate_stations);
        return Object.keys(parsedHeader).reduce((a, c, i) => {
          const temp = a;
          if (i > 0 && c.startsWith('intermediate_stations')) {
            stations.forEach((s, n) => {
              temp[`intermediate_stations_${n + 1}`] = s.station_fullname;
            });
            return temp;
          }

          temp[c] = $item[c];
          return temp;
        }, {});
      }

      return Object.keys(parsedHeader).reduce((a, c) => {
        const temp = a;
        temp[c] = $item[c];
        return temp;
      }, {});
    })
    : items;

  const combindHeadAndContent = parsedHeader ? [parsedHeader, ...parsedItems] : parsedItems;

  console.log(parsedHeader);
  console.log(parsedItems);

  const csv = ConvertToCSV(combindHeadAndContent);

  const exportedFilename = `${fileTitle}.csv` || 'export.csv';

  const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csv], { type: 'text/csv;charset=utf-8;' });

  if (navigator.msSaveBlob) {
    navigator.msSaveBlob(blob, exportedFilename); // IE 10+
  } else {
    const link = document.createElement('a');
    if (link.download !== undefined) {
      // feature detection
      // Browsers that support HTML5 download attribute
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', exportedFilename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}
