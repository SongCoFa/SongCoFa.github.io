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

export default function ExportShiftCSVFile(fileTitle, items, header) {
  let parsedHeader = header || Object.keys(items[0]);

  parsedHeader = Array.isArray(parsedHeader)
    ? parsedHeader.reduce((a, c) => {
      const temp = a;
      temp[c] = c;
      return temp;
    }, {})
    : Object.keys(parsedHeader).reduce((a, c) => {
      const temp = a;

      if (c === 'intermediate_stations') {
        for (let i = 0, len = 12; i < len; i++) {
          temp[`中間站_${i + 1}`] = `中間站 ${i + 1}`;
          temp[`到站時間_${i + 1}`] = `到站時間 ${i + 1}`;
        }
        return temp;
      }

      temp[c] = parsedHeader[c];

      return temp;
    }, {});

  const parsedItems = typeof parsedHeader === 'object'
    ? items.map((item) => {
      const $item = item;

      Object.keys($item).forEach((i) => {
        if ($item[i]) {
          if ($item[i] === 'true' || $item[i] === 'false') {
            $item[i] = $item[i] === 'false' ? '0' : '1';
          }
        }
      });

      if ($item.intermediate_stations) {
        const stations = JSON.parse($item.intermediate_stations);

        if (stations.length > 0) {
          stations.forEach((s, n) => {
            $item[`中間站_${n + 1}`] = s.station_fullname;
            $item[`到站時間_${n + 1}`] = s.ETA;
          });
        }
      }

      return Object.keys(parsedHeader).reduce((a, c) => {
        const temp = a;
        temp[c] = $item[c] ? $item[c] : '';
        return temp;
      }, {});
    }, {})
    : items;

  const combindHeadAndContent = parsedHeader ? [parsedHeader, ...parsedItems] : parsedItems;

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
