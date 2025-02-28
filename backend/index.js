const express = require('express');
const multer = require('multer');
const { S3Client, ListObjectsV2Command, PutObjectCommand } = require('@aws-sdk/client-s3'); // Added PutObjectCommand
const cors = require('cors');
const printer = require("pdf-to-printer");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { PDFDocument , degrees, Rotation} = require('pdf-lib');
require('dotenv').config();


const billingapi = require("./billing");

const app = express();
const port = 5000;

// Configure AWS SDK v3
const s3Client = new S3Client({
  region: 'eu-north-1', // Replace with your bucket's region
  credentials: {
    accessKeyId: 'AKIA4SZHODL7NICUOM7D', // Replace with your IAM user's access key
    secretAccessKey: '/Chdyt/hukd+EvX8cXLWt+b2b/dOg5forVPBKYxP', // Replace with your IAM user's secret key
  },
});

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Enable CORS
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Accept'],
    credentials: true
}));

app.use(cors()); 
//middleware access
app.use(express.json()); 

app.get("/", (req, res) => res.send("Server is running..."));


app.use("/billing", billingapi);

let serialNumber = 1; // Initialize serial number

// **Upload Endpoint**
app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const secretKey = req.body.secretKey;
  if (!secretKey || secretKey.length !== 4 || !/^\d+$/.test(secretKey)) {
    return res.status(400).json({ error: 'Invalid secret key' });
  }

  try {
    // Validate file type
    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({ error: 'Only PDF files are allowed' });
    }

    // Validate file size (10MB)
    if (req.file.size > 10 * 1024 * 1024) {
      return res.status(400).json({ error: 'File size should be less than 10MB' });


    }
    const currentSerialNumber=serialNumber;
    const fileName = `${serialNumber}_${secretKey}.pdf`;
    serialNumber++; // Increment serial number for the next upload

    const params = {
      Bucket: 'venor-printing',
      Key: fileName,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      ACL: 'public-read',
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    const fileUrl = `https://venor-printing.s3.eu-north-1.amazonaws.com/${fileName}`;

    console.log('File uploaded successfully:', fileUrl);
    return res.json({ fileUrl,serialNumber: currentSerialNumber,secretKey });
  } catch (err) {
    console.error('Error uploading file:', err);
    return res.status(500).json({ error: err.message || 'Upload failed' });
  }
});

// **Fetch Latest PDF Endpoint**
app.get('/latest-pdf', async (req, res) => {
  try {
    // List objects in the bucket
    const listParams = { Bucket: 'venor-printing' };
    const data = await s3Client.send(new ListObjectsV2Command(listParams));

    if (!data.Contents || data.Contents.length === 0) {
      return res.status(404).json({ error: 'No PDF files found' });
    }

    // Filter for PDF files
    const pdfFiles = data.Contents.filter((file) => file.Key.endsWith('.pdf'));

    if (pdfFiles.length === 0) {
      return res.status(404).json({ error: 'No PDF files found' });
    }

    // Sort files by upload date (newest first)
    pdfFiles.sort((a, b) => b.LastModified - a.LastModified);

    // Get the latest PDF file
    const latestPdf = pdfFiles[0];

    // Generate a public URL for the latest PDF
    const pdfUrl = `https://${listParams.Bucket}.s3.eu-north-1.amazonaws.com/${latestPdf.Key}`;

    console.log('Latest PDF:', pdfUrl);
    return res.json({ pdfUrl });
  } catch (err) {
    console.error('Error fetching latest PDF:', err);
    return res.status(500).json({ error: 'Failed to fetch latest PDF' });
  }
});

app.get('/getpdf/:number/:password', async (req, res) => {
    try {
        const { number, password } = req.params;
        const listParams = { Bucket: 'venor-printing' };
        const data = await s3Client.send(new ListObjectsV2Command(listParams));

        if (!data.Contents || data.Contents.length === 0) {
            return res.status(404).json({ error: 'No PDF files found' });
        }

        // Check if the requested PDF exists
        const pdfFileName = `${number}_${password}.pdf`;
        const pdfExists = data.Contents.some(file => file.Key === pdfFileName);

        if (!pdfExists) {
            return res.status(401).json({ error: 'Incorrect number or password' }); // 401 Unauthorized
        }

        // Generate a public URL for the found PDF
        const pdfUrl = `https://${listParams.Bucket}.s3.eu-north-1.amazonaws.com/${pdfFileName}`;
        return res.json({ pdfUrl });

    } catch (err) {
        console.error('Error fetching PDF:', err);
        return res.status(500).json({ error: 'Failed to fetch PDF' });
    }
});

//print api sent to printer
app.post("/print", async (req, res) => {
  const { pdfUrl, copies, orientation, colorMode, sidedMode, selectedPages, customPageRange } = req.body;

  if (!pdfUrl) {
      return res.status(400).json({ error: "PDF URL is required" });
  }

  try {
      // Download PDF
      const response = await axios({ url: pdfUrl, responseType: "stream" });
      const filePath = path.join(__dirname, "temp.pdf");
      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);

      writer.on("finish", async () => {
          try {
              // Define print options
              let printOptions = {
                  printer: "Canon LBP2900",
                  copies: copies,
                  orientation: orientation === "landscape" ? "landscape" : "portrait", // Fixed orientation
                  monochrome: colorMode === "bw",
                  sides: sidedMode === "double" ? "two-sided-long-edge" : "one-sided",
              };
              if (selectedPages === "custom" && customPageRange) {
                  printOptions.pages = customPageRange;
              }


              console.log("Print options:", printOptions);

              // Print the PDF
              await printer.print(filePath, printOptions);
              console.log("Printing started!");

              // Delete file after printing
              fs.unlinkSync(filePath);

              res.json({ success: true, message: "Printing started!" });
          } catch (printError) {
              console.error("Printing failed:", printError);
              res.status(500).json({ error: "Printing failed", details: printError.message });
          }
      });

      writer.on("error", (error) => {
          console.error("File write error:", error);
          res.status(500).json({ error: "Failed to save the PDF" });
      });
  } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Failed to process the request", details: error.message });
  }
});

//save the document for checking purpose 
app.post("/save", async (req, res) => {
  const { pdfUrl, orientation,  selectedPages, customPageRange } = req.body;

  if (!pdfUrl) {
    return res.status(400).json({ error: "PDF URL is required" });
  }

  try {
    console.log("Downloading PDF from URL:", pdfUrl);

    // Retry mechanism for downloading the PDF
    let pdfData;
    for (let i = 0; i < 3; i++) { // Try downloading 3 times
      try {
        const response = await axios({ url: pdfUrl, responseType: "arraybuffer" });
        pdfData = response.data;
        console.log("PDF downloaded successfully");
        break;
      } catch (downloadError) {
        console.error(`Attempt ${i + 1} failed:`, downloadError.message);
        if (i === 2) throw new Error("Failed to download PDF after multiple attempts.");
      }
    }

    console.log("Loading PDF into pdf-lib");
    const pdfDoc = await PDFDocument.load(pdfData);
    if (!pdfDoc.getPageCount()) throw new Error("PDF is empty or invalid.");

    console.log("PDF loaded successfully");

    // Create a new PDF document
    const newPdfDoc = await PDFDocument.create();

    // Determine which pages to include
    let pagesToInclude = [];
    if (selectedPages === "custom" && customPageRange) {
      console.log("Using custom page range:", customPageRange);
      pagesToInclude = customPageRange.split(',').map(page => parseInt(page.trim(), 10) - 1);
    } else {
      console.log("Using all pages");
      pagesToInclude = Array.from({ length: pdfDoc.getPageCount() }, (_, i) => i);
    }

    // Ensure pagesToInclude are within valid range
    pagesToInclude = pagesToInclude.filter(index => index >= 0 && index < pdfDoc.getPageCount());

    if (pagesToInclude.length === 0) throw new Error("No valid pages to copy.");

    console.log("Copying pages to new PDF");
    const copiedPages = await newPdfDoc.copyPages(pdfDoc, pagesToInclude);
    copiedPages.forEach(page => newPdfDoc.addPage(page));
    console.log("Pages copied successfully");

    // Set orientation
    if (orientation === "landscape") {
      console.log("Setting orientation to landscape");
      newPdfDoc.getPages().forEach(page => {
        page.setRotation(degrees(90));
      });
    }

    // Save the new PDF document
    console.log("Saving modified PDF");
    const pdfBytes = await newPdfDoc.save();
    const filePath = path.join(__dirname, "modified.pdf");

    // Use async file writing
    await fs.promises.writeFile(filePath, pdfBytes);
    console.log("PDF saved successfully at:", filePath);

    res.json({ success: true, message: "PDF saved successfully!", filePath });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ error: error.message });
  }
});


// **Start Server**
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
