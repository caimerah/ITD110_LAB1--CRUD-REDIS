import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from './AuthContext';
import './App.css';

const API_URL = 'http://localhost:5000/students'; // API endpoint for fetching students

function ListStudents() {
  const { user } = useAuth(); // Get authenticated user info
  const [students, setStudents] = useState([]); // State for storing students list
  const [searchTerm, setSearchTerm] = useState(''); // State for search input

  // Fetch students on component mount
  useEffect(() => {
    fetchStudents();
  }, []);
 
  // Function to fetch students from API
  const fetchStudents = async () => {
    try {
      const response = await axios.get(API_URL);
      setStudents(response.data);
    } catch (error) {
      toast.error('Error fetching students.'); // Display error message if request fails
    }
  };

  // Handle search input change
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter students based on search term
  const filteredStudents = students.filter((student) =>
    Object.values(student).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="list-students">
      <h2>List of Students</h2>

      {/* Search input field */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search students..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
        {/* Clear search button */}
        {searchTerm && (
          <span onClick={() => setSearchTerm('')}>
            &times;
          </span>
        )}
      </div>

      {/* Students table */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Course</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Address</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.length > 0 ? (
            // Render filtered students
            filteredStudents.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.name}</td>
                <td>{student.course}</td>
                <td>{student.age}</td>
                <td>{student.gender}</td>
                <td>{student.address}</td>
                <td>{student.email}</td>
                <td>{student.phone}</td>
                <td>{student.status}</td>
              </tr>
            ))
          ) : (
            // Show message if no students found
            <tr>
              <td colSpan="9" style={{ textAlign: 'center', fontWeight: 'bold', color: 'red' }}>
                Sorry, no students found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ListStudents;
