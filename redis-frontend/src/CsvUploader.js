import React, { useState } from "react";
import axios from "axios";
import Papa from "papaparse";
import "./CsvUploader.css";

const API_URL = "http://localhost:5000"; // Backend endpoint

function CsvUploader() {
  const [csvData, setCsvData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      complete: (result) => {
        setCsvData(result.data);
        setShowPopup(true);
      },
      header: true, // Parses CSV with headers
      skipEmptyLines: true,
    });
  };

  const handleUploadToDB = async () => {
    try {
      await axios.post(API_URL, { data: csvData });
      alert("CSV data uploaded successfully to Redis!");
      setShowPopup(false);
    } catch (error) {
      console.error("Error uploading CSV data:", error);
      alert("Failed to upload CSV data.");
    }
  };

  return (
    <div className="csv-uploader">
      <input type="file" id="file-upload" onChange={handleFileUpload} />

      {showPopup && (
        <div className="csv-container">
          <div className="popup-content">
            <table>
              <thead>
                <tr>
                  {csvData.length > 0 &&
                    Object.keys(csvData[0]).map((key, index) => (
                      <th key={index}>{key}</th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {csvData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {Object.values(row).map((value, colIndex) => (
                      <td key={colIndex}>{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={handleUploadToDB}>Upload to Database</button>
            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CsvUploader;
