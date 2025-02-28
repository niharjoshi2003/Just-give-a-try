import React, { useState, useRef, useEffect } from "react";
import { Upload, Check, Loader, FileText } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = "http://localhost:5000"; // Move to environment variable in production

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [secretKey, setSecretKey] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  // const [latestPdfUrl, setLatestPdfUrl] = useState("");
  const fileInputRef = useRef(null);
  const [serialnumber,seserialnumber]=useState(null);
  const [secretkey,setsecretkey]=useState(null);


  

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setError("");
    setUploadProgress(0);

    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("File size should be less than 10MB");
        toast.error("File size should be less than 10MB");
        return;
      }

      if (selectedFile.type !== "application/pdf") {
        setError("Please upload PDF documents only");
        toast.error("Please upload PDF documents only");
        return;
      }

      setFile(selectedFile);
      toast.success("File selected successfully!");
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const selectedFile = event.dataTransfer.files[0];
    if (selectedFile) {
      fileInputRef.current.files = event.dataTransfer.files;
      handleFileChange({ target: fileInputRef.current });
    }
  };

  const saveDocument = async () => {
    if (!file || !secretKey) return;

    try {
      setUploading(true);
      setError("");
      setUploadProgress(10);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("secretKey", secretKey);

      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: "POST",
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `Upload failed with status: ${response.status}`);
      }

      const data = await response.json();

      if (data.serialNumber) {
        seserialnumber(data.serialNumber)
      }
      if (data.secretKey) {
        setsecretkey(data.secretKey)
      }
      

      if (data?.fileUrl) {
        setUploadProgress(100);
        toast.success("File uploaded successfully!");
        setFile(null);
        setSecretKey("");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        
      } else {
        throw new Error("Upload failed - No file URL received");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || "Upload failed");
      toast.error(err.message || "Upload failed");
    } finally {
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">PDF Upload</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div
        className="bg-white rounded-lg shadow-md p-4 mb-4"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
            accept=".pdf,application/pdf"
            ref={fileInputRef}
          />
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center cursor-pointer"
          >
            <Upload className="w-8 h-8 text-blue-500 mb-2" />
            <span className="text-sm text-gray-600">
              {file ? file.name : "Drag & drop or tap to upload PDF"}
            </span>
            <span className="text-xs text-gray-500 mt-1">
              Maximum file size: 10MB
            </span>
          </label>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <label htmlFor="secret-key" className="block text-sm font-medium text-gray-700">
          Secret Key (4 digits)
        </label>
        <input
          type="text"
          id="secret-key"
          value={secretKey}
          onChange={(e) => setSecretKey(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          maxLength="4"
          placeholder="Enter 4-digit secret key"
        />
      </div>

      {serialnumber &&(
        <div>
          <h2>Your serial number is : </h2>
          <h3>{serialnumber}</h3>
          <h2>Your Secret Key is : </h2>
          <h3>{secretkey}</h3>
        </div>

      )}

      

      {uploadProgress > 0 && (
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Uploading: {uploadProgress}%
          </p>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <button
          onClick={saveDocument}
          disabled={!file || uploading || !secretKey}
          className={`w-full py-3 rounded-lg flex items-center justify-center space-x-2
            ${
              file && !uploading && secretKey
                ? "bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                : "bg-gray-300 text-gray-500"
            }`}
        >
          {uploading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <Check className="w-5 h-5" />
              <span>Save</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default FileUpload;