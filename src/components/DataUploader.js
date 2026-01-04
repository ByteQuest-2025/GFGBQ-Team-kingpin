// src/components/DataUploader.js
import React, { useState } from 'react';
import Papa from 'papaparse';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

const DataUploader = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setStatus("Parsing CSV...");

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const data = results.data;
        setStatus(`Found ${data.length} rows. Uploading unique hospitals...`);
        
        // We use a Map to ensure we only get the latest entry for each unique Hospital Name
        const uniqueHospitals = new Map();

        data.forEach((row) => {
          if (row.Hospital) {
            const cleanedData = {
              name: row.Hospital,
              // Convert these to numbers so we can do math on them later
              availableBeds: Number(row.Available_Beds) || 0,
              icuOccupancy: Number(row.ICU_Occupancy_Pct) || 0,
              occupancyPct: Number(row.Occupancy_Pct) || 0,
              doctorsOnDuty: Number(row.Doctor_On_Duty) || 0,
              waitTimes: Number(row.Avg_Wait_Time_Min) || 0,
              location: "Chennai", // Placeholder
              status: row.Status || "Normal",
              lastUpdated: new Date()
            };
            uniqueHospitals.set(row.Hospital, cleanedData);
          }
        });

        try {
          const uploadPromises = Array.from(uniqueHospitals.values()).map(async (hospitalData) => {
             // Create a document ID based on the hospital name
             const docId = hospitalData.name.replace(/\s+/g, '_').toLowerCase();
             // CORRECTED LINE:
             await setDoc(doc(db, "hospitals", docId), hospitalData);
          });

          await Promise.all(uploadPromises);
          setStatus(`Success! ${uniqueHospitals.size} Hospitals initialized in Database.`);
        } catch (error) {
          console.error("Error uploading:", error);
          setStatus("Error uploading data. Check console.");
        }
        setLoading(false);
      }
    });
  };

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", margin: "20px" }}>
      <h3>🛠 System Setup: Upload Hospital Data</h3>
      <p>Select your generated CSV file to initialize the database.</p>
      <input type="file" accept=".csv" onChange={handleFileUpload} disabled={loading} />
      <p><strong>Status:</strong> {status}</p>
    </div>
  );
};

export default DataUploader;