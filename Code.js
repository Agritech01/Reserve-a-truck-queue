const SOURCE_SHEET_ID = '1muM0LdvbuRpmZfqcVyN-nh-bdjmDgRczmpMHcwIFFmE'; 
const DEST_SHEET_ID = '1MMl-gC_iML3N8H6cRrgfX-9tg1WNKPhAtbj7KUFHJrU'; 
const DEST_SHEET_NAME = 'สถานะการจอง'; 

// ฟังก์ชันสำหรับรับข้อมูลจากหน้าเว็บ GitHub (POST Method)
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    // ตรวจสอบว่าเป็นคำสั่งค้นหา (Search) หรือบันทึก (Submit)
    if (data.action === 'search') {
      const res = getQuotaData(data.quota);
      return createJsonResponse(res);
    } else {
      const result = processForm(data);
      return createJsonResponse({ success: true, message: result });
    }
  } catch (err) {
    return createJsonResponse({ success: false, error: err.toString() });
  }
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function getQuotaData(quotaId) {
  const ss = SpreadsheetApp.openById(SOURCE_SHEET_ID);
  const sheet = ss.getSheetByName('สถานะ'); 
  const data = sheet.getDataRange().getValues();
  const searchId = quotaId.toString().trim();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] && data[i][0].toString().trim() === searchId) { 
      return { success: true, farmerName: data[i][1], officerName: data[i][2], phone: data[i][3] };
    }
  }
  return { success: false };
}

function processForm(formData) {
  const ss = SpreadsheetApp.openById(DEST_SHEET_ID);
  let sheet = ss.getSheetByName(DEST_SHEET_NAME);
  
  if (!sheet) {
    sheet = ss.insertSheet(DEST_SHEET_NAME);
    sheet.appendRow(["วันที่เข้า", "ช่วงเวลา", "ประเภทรถ", "ทะเบียนรถ", "เลขโควตา", "ชื่อชาวไร่", "ชื่อนักเกษตร", "เบอร์โทร"]);
  }

  const rowData = [formData.date, formData.timeslot, formData.carType, formData.plate, formData.quota, formData.farmerName, formData.officerName, formData.phone];

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
