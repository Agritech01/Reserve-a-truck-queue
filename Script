// 1. ID ไฟล์ข้อมูลพื้นฐาน (ที่มีชื่อชาวไร่และเบอร์โทร)
const SOURCE_SHEET_ID = '1muM0LdvbuRpmZfqcVyN-nh-bdjmDgRczmpMHcwIFFmE'; 
// 2. ID ไฟล์ปลายทาง (ที่ต้องการให้ข้อมูลไปบันทึก)
const DEST_SHEET_ID = '1MMl-gC_iML3N8H6cRrgfX-9tg1WNKPhAtbj7KUFHJrU'; 

const DEST_SHEET_NAME = 'สถานะการจอง'; 

function doGet() {
  return HtmlService.createTemplateFromFile('Index')
      .evaluate()
      .setTitle('ระบบจองคิวรถบรรทุก')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * ดึงข้อมูลชาวไร่ นักเกษตร และเบอร์โทร
 * โดยอ้างอิง: Col A=โควตา, Col B=ชื่อชาวไร่, Col C=ชื่อนักเกษตร, Col D=เบอร์โทร
 */
function getQuotaData(quotaId) {
  if (!quotaId) return null;
  try {
    const ss = SpreadsheetApp.openById(SOURCE_SHEET_ID);
    const sheet = ss.getSheetByName('สถานะ'); 
    const data = sheet.getDataRange().getValues();
    const searchId = quotaId.toString().trim();
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] && data[i][0].toString().trim() === searchId) { 
        return { 
          success: true,
          farmerName: data[i][1], 
          officerName: data[i][2],
          phone: data[i][3] // ข้อมูลเบอร์โทรศัพท์จาก Column D
        };
      }
    }
    return { success: false, error: "ไม่พบข้อมูลโควตานี้" };
  } catch (e) { 
    return { success: false, error: "ไม่สามารถเข้าถึงฐานข้อมูลได้" }; 
  }
}

/**
 * บันทึกข้อมูลลง Google Sheets ปลายทาง
 * ไม่มีการบันทึก Timestamp ตามความต้องการของผู้ใช้
 */
function processForm(formData) {
  try {
    const ss = SpreadsheetApp.openById(DEST_SHEET_ID);
    let sheet = ss.getSheetByName(DEST_SHEET_NAME);
    
    // ถ้าไม่มี Sheet ให้สร้างใหม่พร้อมหัวตาราง
    if (!sheet) {
      sheet = ss.insertSheet(DEST_SHEET_NAME);
      sheet.appendRow(["วันที่เข้า", "ช่วงเวลา", "ประเภทรถ", "ทะเบียนรถ", "เลขโควตา", "ชื่อชาวไร่", "ชื่อนักเกษตร", "เบอร์โทร"]);
    }

    // เตรียมข้อมูลแถวที่จะบันทึก
    const rowData = [
      formData.date, 
      formData.timeslot, 
      formData.carType, 
      formData.plate, 
      formData.quota, 
      formData.farmerName, 
      formData.officerName,
      formData.phone
    ];

    // เงื่อนไขพิเศษสำหรับ "แม่พ่วงและลูกพ่วง"
    if (formData.carType === 'แม่พ่วงและลูกพ่วง') {
      // แถวที่ 1: บันทึกคันแม่ (เปลี่ยนชื่อประเภทรถเป็น "แม่พ่วง")
      let mainTruck = [...rowData];
      mainTruck[2] = 'แม่พ่วง'; 
      sheet.appendRow(mainTruck); 

      // แถวที่ 2: บันทึกคันลูก
      let trailerTruck = [...rowData];
      trailerTruck[2] = 'ลูกพ่วง';
      trailerTruck[3] = formData.trailerPlate; // ใช้ทะเบียนลูกพ่วง
      sheet.appendRow(trailerTruck);
      
    } else {
      // กรณีรถประเภทอื่นๆ (สิบล้อ, หกล้อ, อีแต๋น, เทรลเลอร์) บันทึกแถวเดียวปกติ
      sheet.appendRow(rowData);
    }
    
    // แก้ไขจุดนี้: ส่งกลับเป็น String เพื่อป้องกัน [object Object]
    return "✅ บันทึกข้อมูลการจองสำเร็จ!"; 
  } catch (e) {
    return "❌ ข้อผิดพลาด: " + e.toString();
  }
}
