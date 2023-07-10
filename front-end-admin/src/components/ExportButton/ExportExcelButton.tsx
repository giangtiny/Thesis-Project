import { TIME_TEXT } from '@/constants/asset';
import FormatOutputDate from '@/utils/formats/FormatDate';
import { Button } from '@mantine/core';
import React from 'react';
import * as XLSX from 'xlsx-js-style';
interface StatisticProps {
  createdBy: string,
  totalPaidDeposit: number,
  totalRemain: number,
  totalRevenue: number,
  performance: number,
  records: {
    checkOut: string,
    createdBy: string,
    performance: number,
    totalPaidDeposit: number,
    totalRemain: number,
    totalRevenue: number
  }[],
}

interface RowProps {
  col1: string,
  col2: number,
  col3: number,
  col4: number,
  col5: number,
}

export default function ExportExcelButton(props: { name: string, type: string, orderType: string, time: Date | number | null, data: StatisticProps[] }) {
  const handleExportFileExcel = () => {
    console.log('data', props.data);
    const now = new Date()
    // title
    const rowTitleOffline = [{ col1: `BÁO CÁO DOANH THU TỔNG HỢP ĐƠN HÀNG TRỰC TIẾP`, col2: '', col3: '', col4: '', col5: '' }]
    const rowTitleOnline = [{ col1: `BÁO CÁO DOANH THU TỔNG HỢP ĐƠN HÀNG TRỰC TUYẾN`, col2: '', col3: '', col4: '', col5: '' }]
    // format file
    const dataFile = [
      { col1: `Tháng: ${now.getMonth() + 1}`, col2: `Năm: ${now.getFullYear()}`, col3: '', col4: '', col5: '' },
      { col1: 'CÔNG TY TNHH THƯƠNG MẠI DỊCH VỤ DU LỊCH TRE BAY', col2: '', col3: '', col4: '', col5: '' },
      { col1: 'Số điện thoại liên hệ: 0933668895', col2: '', col3: '', col4: '', col5: '' },
      { col1: 'Địa chỉ: Số 25/1 Thùy Vân, Phường 2, Thành phố Vũng Tàu, Tỉnh Bà Rịa - Vũng Tàu', col2: '', col3: '', col4: '', col5: '' },
      { col1: '', col2: '', col3: '', col4: '', col5: '' },
      { col1: 'Ngày', col2: 'Tổng tiền cọc (VND)', col3: 'Tổng tiền thu sau (VND)', col4: 'Tổng doanh thu (VND)', col5: 'Hiệu suất (Lượt)' },
    ]
    const rowTotalOffLine: RowProps[] = []
    const rowTotalOnLine: RowProps[] = []
    const dataOffline: RowProps[] = [];
    const dataOnline: RowProps[] = [];
    props.data.forEach(item => {
      let countDup = 0;
      item.records.sort((current: any, next: any) => {
        return current.checkOut.localeCompare(next.checkOut)
      })
      if (item.createdBy === 'client') {
        rowTotalOnLine.push({
          col1: 'Tổng cộng', col2: item.totalPaidDeposit, col3: item.totalRemain, col4: item.totalRevenue, col5: item.performance
        })
        item.records.forEach((itemDate, index) => {
          // check date is calculated because dup
          if (countDup > 0) {
            countDup -= 1;
            return;
          }
          const thisDate = new Date(itemDate.checkOut);
          let sumOfDate = {
            col1: FormatOutputDate(thisDate), col2: itemDate.totalPaidDeposit, col3: itemDate.totalRemain, col4: itemDate.totalRevenue, col5: itemDate.performance
          };
          if (index < item.records.length) {
            while (index + countDup < item.records.length && thisDate.getDate() === new Date(item.records[index + countDup].checkOut).getDate()) {
              countDup += 1;
              sumOfDate.col2 += item.records[index + countDup].totalPaidDeposit;
              sumOfDate.col3 += item.records[index + countDup].totalRemain;
              sumOfDate.col4 += item.records[index + countDup].totalRevenue;
              sumOfDate.col5 += item.records[index + countDup].performance;
              continue;
            }
          }
          dataOnline.push(sumOfDate)
        })
      }
      if (item.createdBy === 'admin') {
        rowTotalOffLine.push({
          col1: 'Tổng cộng', col2: item.totalPaidDeposit, col3: item.totalRemain, col4: item.totalRevenue, col5: item.performance
        })
        item.records.forEach((itemDate, index) => {
          // check date is calculated because dup
          if (countDup > 0) {
            countDup -= 1;
            return;
          }
          const thisDate = new Date(itemDate.checkOut);
          let sumOfDate = {
            col1: FormatOutputDate(thisDate), col2: itemDate.totalPaidDeposit, col3: itemDate.totalRemain, col4: itemDate.totalRevenue, col5: itemDate.performance
          };
          if (index < item.records.length) {
            while (index + countDup + 1 < item.records.length && thisDate.getDate() === new Date(item.records[index + countDup + 1].checkOut).getDate()) {
              sumOfDate.col2 += item.records[index + countDup + 1].totalPaidDeposit;
              sumOfDate.col3 += item.records[index + countDup + 1].totalRemain;
              sumOfDate.col4 += item.records[index + countDup + 1].totalRevenue;
              sumOfDate.col5 += item.records[index + countDup + 1].performance;
              countDup += 1;
              continue;
            }
          }
          dataOffline.push(sumOfDate)
        })
      }
    })

    const worksheetOnline = XLSX.utils.json_to_sheet([...rowTitleOnline, ...dataFile, ...dataOnline, ...rowTotalOnLine], { skipHeader: true });
    const worksheetOffline = XLSX.utils.json_to_sheet([...rowTitleOffline, ...dataFile, ...dataOffline, ...rowTotalOffLine], { skipHeader: true });
    const columnWidths = [
      { wch: 20 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 15 },
    ];

    // format number money
    const numberFormat = '#,##0';
    const columnsToFormat = [1, 2, 3, 4];
    const numberFormatCellRangeOnline = XLSX.utils.decode_range(worksheetOnline['!ref'] as string);
    const numberFormatCellRangeOffline = XLSX.utils.decode_range(worksheetOffline['!ref'] as string);

    for (let row = numberFormatCellRangeOnline.s.r + 1; row <= numberFormatCellRangeOnline.e.r; row++) {
      columnsToFormat.forEach(column => {
        const cellRef = XLSX.utils.encode_cell({ r: row, c: column });
        worksheetOnline[cellRef].z = numberFormat;
      });
    }

    for (let row = numberFormatCellRangeOffline.s.r + 1; row <= numberFormatCellRangeOffline.e.r; row++) {
      columnsToFormat.forEach(column => {
        const cellRef = XLSX.utils.encode_cell({ r: row, c: column });
        worksheetOffline[cellRef].z = numberFormat;
      });
    }

    const workbook = XLSX.utils.book_new();

    // merge cell a1 to c1
    const mergeCells = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } },
      { s: { r: 2, c: 0 }, e: { r: 2, c: 2 } },
      { s: { r: 3, c: 0 }, e: { r: 3, c: 1 } },
      { s: { r: 4, c: 0 }, e: { r: 4, c: 3 } },
    ];

    worksheetOnline['!rows'] = [{ hpt: 30 }];
    worksheetOffline['!rows'] = [{ hpt: 30 }];

    // update Horizontal for worksheet
    worksheetOnline['!cols'] = columnWidths;
    worksheetOnline['!merges'] = mergeCells;
    worksheetOffline['!cols'] = columnWidths;
    worksheetOffline['!merges'] = mergeCells;


    const cellBoldCenter = ['A1', 'A3', 'A7', 'B7', 'C7', 'D7', 'E7'];
    const cellLightGreen = ['A7', 'B7', 'C7', 'D7', 'E7'];
    const numOfCellTotalOnline = 7 + 1 + dataOnline.length;
    const numOfCellTotalOffline = 7 + 1 + dataOffline.length;
    const cellOrangeOnline = [`A${numOfCellTotalOnline}`, `B${numOfCellTotalOnline}`, `C${numOfCellTotalOnline}`, `D${numOfCellTotalOnline}`, `E${numOfCellTotalOnline}`,];
    const cellOrangeOffline = [`A${numOfCellTotalOffline}`, `B${numOfCellTotalOffline}`, `C${numOfCellTotalOffline}`, `D${numOfCellTotalOffline}`, `E${numOfCellTotalOffline}`,];
    const cellBold = ['A3'];
    // const cellCenter = ['A8'];

    cellBoldCenter.forEach(item => {
      const cellOnline = worksheetOnline[item];
      const cellOffline = worksheetOffline[item];
      cellOnline.s = {
        alignment: { horizontal: 'center', vertical: 'center' },
        font: { bold: true },
      };
      cellOffline.s = {
        alignment: { horizontal: 'center', vertical: 'center' },
        font: { bold: true },
      };
    })
    cellBold.forEach(item => {
      const cellOnline = worksheetOnline[item];
      const cellOffline = worksheetOffline[item];
      cellOnline.s = {
        font: { bold: true },
      };
      cellOffline.s = {
        font: { bold: true },
      };
    })
    // cellCenter.forEach(item => {
    //   const cellOnline = worksheetOnline[item];
    //   const cellOffline = worksheetOffline[item];
    //   cellOnline.s = {
    //     alignment: { horizontal: 'center', vertical: 'center' },
    //   };
    //   cellOffline.s = {
    //     alignment: { horizontal: 'center', vertical: 'center' },
    //   };
    // })

    const cellTitle = ['A1'];
    cellTitle.forEach(item => {
      const cellOnline = worksheetOnline[item];
      const cellOffline = worksheetOffline[item];
      cellOnline.s = {
        font: { sz: 20 },
        alignment: { horizontal: 'center', vertical: 'center' },
      }
      cellOffline.s = {
        font: { sz: 20 },
        alignment: { horizontal: 'center', vertical: 'center' },
      }
    })
    cellLightGreen.forEach(item => {
      const cellOnline = worksheetOnline[item];
      const cellOffline = worksheetOffline[item];
      const lightGreenColor = "93C47D"
      cellOnline.s = {
        alignment: { horizontal: 'center', vertical: 'center' },
        font: { bold: true },
        fill: { patternType: "solid", fgColor: { rgb: lightGreenColor } }
      }
      cellOffline.s = {
        alignment: { horizontal: 'center', vertical: 'center' },
        font: { bold: true },
        fill: { patternType: "solid", fgColor: { rgb: lightGreenColor } }
      }
    })
    cellOrangeOnline.forEach(item => {
      const cellOnline = worksheetOnline[item];
      const orangeColor = "ED7D31"
      cellOnline.s = {
        fill: { patternType: "solid", fgColor: { rgb: orangeColor } }
      }
    })
    cellOrangeOffline.forEach(item => {
      const cellOffline = worksheetOffline[item];
      const orangeColor = "ED7D31"
      cellOffline.s = {
        fill: { patternType: "solid", fgColor: { rgb: orangeColor } }
      }
    })
    if (props.orderType === 'online') {
      XLSX.utils.book_append_sheet(workbook, worksheetOnline, `ĐH Trực tuyến ${props.type === TIME_TEXT.date ? '(Theo ngày)' : '(Theo tháng)'}`);
    }
    if (props.orderType === 'offline') {
      XLSX.utils.book_append_sheet(workbook, worksheetOffline, `ĐH Trực tiếp ${props.type === TIME_TEXT.date ? '(Theo ngày)' : '(Theo tháng)'}`);
    }
    XLSX.writeFile(workbook, 'Thống-kê-doanh-thu.xlsx');
  };

  return (
    <Button color='teal' onClick={handleExportFileExcel}>{props.name}</Button>
  );
};
