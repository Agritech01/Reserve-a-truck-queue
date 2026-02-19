const DEST_SHEET_ID = '1MMl-gC_iML3N8H6cRrgfX-9tg1WNKPhAtbj7KUFHJrU';
const DEST_SHEET_NAME = 'สถานะการจอง';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.openById(DEST_SHEET_ID);
    let sheet = ss.getSheetByName(DEST_SHEET_NAME) || ss.insertSheet(DEST_SHEET_NAME);
    
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["วันที่เข้า", "ช่วงเวลา", "ประเภทรถ", "ทะเบียนรถ", "เลขโควตา", "ชื่อชาวไร่", "ชื่อนักเกษตร", "เบอร์โทร"]);
    }

    const rowData = [data.date, data.timeslot, data.carType, data.plate, data.quota, data.farmerName, data.officerName, data.phone];

    if (data.carType === 'แม่พ่วงและลูกพ่วง') {
      let main = [...rowData]; main[2] = 'แม่พ่วง';
      sheet.appendRow(main);
      let trailer = [...rowData]; trailer[2] = 'ลูกพ่วง';
      trailer[3] = data.trailerPlate;
      sheet.appendRow(trailer);
    } else {
      sheet.appendRow(rowData);
    }
    return ContentService.createTextOutput(JSON.stringify({ success: true, message: "✅ บันทึกข้อมูลสำเร็จ!" })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}
