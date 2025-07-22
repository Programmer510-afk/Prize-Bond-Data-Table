const express = require('express');
const XLSX = require('xlsx');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());

const PORT = process.env.PORT || 3000;

// ✅ ঠিকভাবে Excel ফাইলের লিংক দিন
const EXCEL_URL = "https://raw.githubusercontent.com/Programmer510-afk/Prize-Bond-Data-Table/main/Prize_Bond_Excel_Table.xlsx";

// fetch লাইব্রেরি ইমপোর্ট করুন
const fetch = require('node-fetch');

app.get('/api/excel-data', async (req, res) => {
  try {
    const response = await fetch(EXCEL_URL);
    const arrayBuffer = await response.arrayBuffer();
    const data = Buffer.from(arrayBuffer);

    const workbook = XLSX.read(data, { type: 'buffer' });
    const result = {};

    workbook.SheetNames.forEach(sheetName => {
      const sheet = workbook.Sheets[sheetName];
      result[sheetName] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    });

    res.json(result);
  } catch (error) {
    console.error("Error fetching or parsing Excel:", error);
    res.status(500).json({ error: "Failed to load Excel data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
