// ส่วนของข้อมูลเหมือนเดิม
const SOURCE_SHEET_ID = '1muM0LdvbuRpmZfqcVyN-nh-bdjmDgRczmpMHcwIFFmE'; 
const DEST_SHEET_ID = '1MMl-gC_iML3N8H6cRrgfX-9tg1WNKPhAtbj7KUFHJrU'; 

// เพิ่มฟังก์ชัน doPost เพื่อรับข้อมูลจากเว็บภายนอก
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const result = processFormExternally(data);
    return ContentService.createTextOutput(JSON.stringify({result: result}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({result: "error", error: err.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ปรับปรุงฟังก์ชันบันทึกข้อมูลเล็กน้อยเพื่อรับค่าจาก JSON
function processFormExternally(formData) {
  const ss = SpreadsheetApp.openById(DEST_SHEET_ID);
  let sheet = ss.getSheetByName('สถานะการจอง');
  
  const rowData = [
    formData.date, formData.timeslot, formData.carType, 
    formData.plate, formData.quota, formData.farmerName, 
    formData.officerName, formData.phone
  ];

  if (formData.carType === 'แม่พ่วงและลูกพ่วง') {
    let mainTruck = [...rowData]; mainTruck[2] = 'แม่พ่วง';
    sheet.appendRow(mainTruck);
    let trailerTruck = [...rowData]; trailerTruck[2] = 'ลูกพ่วง';
    trailerTruck[3] = formData.trailerPlate;
    sheet.appendRow(trailerTruck);
  } else {
    sheet.appendRow(rowData);
  }
  return "✅ บันทึกข้อมูลการจองสำเร็จ!";
}
