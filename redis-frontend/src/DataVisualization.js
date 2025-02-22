import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Plot from "react-plotly.js";
import "./App.css";

const API_URL = "http://localhost:5000/students";

const DataVisualization = () => {
  const [students, setStudents] = useState([]);

  // Fetch students data from API
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(API_URL);
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students", error);
    }
  };

  // Gender Distribution Data
  const genderData = useMemo(() => [
    { name: "Male", value: students.filter((s) => s.gender === "Male").length },
    { name: "Female", value: students.filter((s) => s.gender === "Female").length },
  ], [students]);

  // Course Enrollment Data
  const courseEnrollment = useMemo(() => {
    const counts = students.reduce((acc, student) => {
      acc[student.course] = (acc[student.course] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(counts).map((course) => ({ name: course, count: counts[course] }));
  }, [students]);

  // Active vs Inactive Students Data
  const activeInactiveData = useMemo(() => [
    { name: "Active", value: students.filter((s) => s.status === "Active").length },
    { name: "Inactive", value: students.filter((s) => s.status === "Inactive").length }
  ], [students]);

  
  // Grouped Data for Course Popularity by Gender
  const groupedData = useMemo(() => {
    if (!students || students.length === 0) return {};
    return students.reduce((acc, student) => {
      if (!acc[student.course]) acc[student.course] = { Male: [], Female: [] };
      acc[student.course][student.gender].push(1);
      return acc;
    }, {});
  }, [students]);

  return (
    <div className="visualization-container">
      <div className="chart-grid">
        {/* Gender Distribution Pie Chart */}
        <div className="chart-card">
          <h2 className="ctitle">Gender Distribution</h2>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={genderData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} fill="#003366" label>
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.name === "Male" ? "#1E90FF" : "#FC6C85"} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Course Enrollment Bar Chart */}
        <div className="chart-card">
          <h2 className="ctitle">Course Enrollment</h2>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={courseEnrollment}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#1E90FF" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Active vs Inactive Students Pie Chart */}
        <div className="chart-card">
          <h2 className="ctitle">Active vs Inactive Students</h2>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={activeInactiveData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                  {activeInactiveData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.name === "Active" ? "#FC6C85" : "#BDBDBD"} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Course Popularity by Gender - Bar Chart */}
        <div className="chart-card">
          <h2 className="ctitle">Course Popularity Based on Gender</h2>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height={350}>
              <Plot
                data={[
                  {
                    x: Object.keys(groupedData),
                    y: Object.keys(groupedData).map((course) => groupedData[course].Male.length),
                    type: "bar",
                    name: "Male",
                    marker: { color: "#1E90FF" },
                  },
                  {
                    x: Object.keys(groupedData),
                    y: Object.keys(groupedData).map((course) => groupedData[course].Female.length),
                    type: "bar",
                    name: "Female",
                    marker: { color: "#FC6C85" },
                  }
                ]}
                layout={{
                  title: "Course Popularity Based on Gender",
                  xaxis: { title: "Courses" },
                  yaxis: { title: "Student Count" },
                  barmode: "group",
                }}
              />
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataVisualization;
