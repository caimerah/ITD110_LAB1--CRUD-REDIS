import React, { useState } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { AuthProvider, useAuth } from "./AuthContext.js";
import ListStudents from "./ListStudents.js";
import ManageStudents from "./ManageStudents.js";
import DataVisualization from "./DataVisualization.js";
import CsvUploader from "./CsvUploader.js"; // Import CSV Upload Component
import Login from "./Login.js";

const API_URL = "http://localhost:5000";

function App() {
  return (
    <AuthProvider>
      <Dashboard />
    </AuthProvider>
  );
}

function Dashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("list");
  const [formData, setFormData] = useState({ idNo: "", name: "", course: "" });
  const [status, setStatus] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isInputModal, setIsInputModal] = useState(false);

  if (!user) {
    return <Login />;
  }

  const handleUserCheck = async () => {
    let missingFields = [];
  
    // Check if any field is empty and push the missing fields into the array
    if (!formData.idNo) missingFields.push("ID No");
    if (!formData.name) missingFields.push("Name");
    if (!formData.course) missingFields.push("Course");
  
    // If there are missing fields, show the specific error message
    if (missingFields.length > 0) {
      setStatus("Not found");
      setModalMessage(`Please fill in the following field(s): ${missingFields.join(", ")}`);
      setIsInputModal(true); // Show the input modal again
      setShowModal(true); // Show the modal with the error message
      return; // Stop the function if fields are empty
    }
  
    try {
      const response = await axios.get(`${API_URL}/students/${formData.idNo}`);
      if (
        response.data &&
        response.data.name.toLowerCase() === formData.name.toLowerCase() &&
        response.data.course.toLowerCase() === formData.course.toLowerCase()
      ) {
        setStatus(response.data.status);
        setModalMessage(`Your status is ${response.data.status.toUpperCase()}`);
      } else {
        setStatus("Not found");
        setModalMessage("DATA NOT FOUND. PLEASE INPUT CORRECT DETAILS");
      }
    } catch (error) {
      setStatus("Not found");
      setModalMessage("DATA NOT FOUND. PLEASE INPUT CORRECT DETAILS");
    }
    setIsInputModal(false);
    setShowModal(true);
  };
  
  

  return (
    <div className="app-container">
      <h1>Student CRUD with REDIS</h1>
      <nav>
  {user.role === "admin" && (
    <>
      <button onClick={() => setActiveTab("list")}>List of Students</button>
      <button onClick={() => setActiveTab("manage")}>Manage Students</button>
      <button onClick={() => setActiveTab("visualization")}>Data Visualization</button>
      <button onClick={() => setActiveTab("upload")}>Upload CSV</button>
      <button onClick={logout}>Logout</button> {/* Admin logout stays in navbar */}
    </>
  )}
</nav>


      {user.role === "admin" ? (
  <>
    {activeTab === "list" && <ListStudents />}
    {activeTab === "manage" && <ManageStudents />}
    {activeTab === "visualization" && <DataVisualization />}
    {activeTab === "upload" && <CsvUploader />} {/* New CSV Upload Page */}
  </>
) : (
  <div className="user-buttons">
    <button onClick={() => { setIsInputModal(true); setShowModal(true); }}>Check Your Status</button>
    <button onClick={logout}>Logout</button> {/* Logout is here only for normal users */}
  </div>
)}


      {showModal && (
        <div className="modal">
          <form>
            {isInputModal ? (
              <>
                <h2>Check Your Status</h2>
                <input
                  type="text"
                  placeholder="ID No"
                  value={formData.idNo}
                  onChange={(e) => setFormData({ ...formData, idNo: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Course"
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                />
                <button type="button" onClick={handleUserCheck}>Submit</button>
              </>
            ) : (
              <>
                <h2>Status Check</h2>
                <p>{modalMessage}</p>
              </>
            )}
            <button type="button" onClick={() => setShowModal(false)}>Close</button>
          </form>
        </div>
      )}

      <ToastContainer position="bottom-right" />
      <footer className="footer">ABDUL, CAIMERAH C. ITD110 - LABORATORY EXERCISES #1</footer>
    </div>
  );
}

export default App;
