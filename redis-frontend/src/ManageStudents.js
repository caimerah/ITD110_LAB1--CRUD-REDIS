import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

const API_URL = 'http://localhost:5000/students';

function ManageStudents() {
  // State management
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    course: '',
    age: '',
    gender: 'Male',
    address: '',
    email: '',
    phone: '',
    status: 'Active',
  });

  // Fetch students on component mount
  useEffect(() => {
    fetchStudents();
  }, []);

  // Fetch students from API
  const fetchStudents = async () => {
    try {
      const response = await axios.get(API_URL);
      setStudents(response.data);
    } catch (error) {
      toast.error('Error fetching students.');
    }
  };

  // Handle input change for form fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle search input change
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle form submission for adding/updating students
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`${API_URL}/${formData.id}`, formData);
        toast.success('Student updated successfully!');
      } else {
        await axios.post(API_URL, formData);
        toast.success('Student added successfully!');
      }
      fetchStudents(); // Refresh data
      resetForm();
    } catch (error) {
      toast.error('Error saving student.');
    }
  };

  // Handle edit button click
  const handleEdit = (student) => {
    setFormData(student);
    setIsEditing(true);
    setShowModal(true);
  };

  // Handle delete button click
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      toast.success('Student deleted successfully!');
      fetchStudents(); // Refresh data
    } catch (error) {
      toast.error('Error deleting student.');
    }
  };

  // Reset form fields
  const resetForm = () => {
    setShowModal(false);
    setIsEditing(false);
    setFormData({
      id: '',
      name: '',
      course: '',
      age: '',
      gender: 'Male',
      address: '',
      email: '',
      phone: '',
      status: 'Active',
    });
  };

  // Filter students based on search term
  const filteredStudents = students.filter((student) =>
    Object.values(student).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div>
      <h2>Manage Students</h2>
      
      {/* Action Buttons and Search Bar */}
      <div className="actions-container">
        <button className="action-button" onClick={() => { setShowModal(true); setIsEditing(false); }}>
          Add Student
        </button>
        
        <div className="search-container">
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
          {searchTerm && (
            <span className="clear-search" onClick={() => setSearchTerm('')} title="Clear search">
              &times;
            </span>
          )}
        </div>
      </div>
      
      {/* Students Table */}
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.length > 0 ? (
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
                <td>
                  <button onClick={() => handleEdit(student)}>Edit</button>
                  <button onClick={() => handleDelete(student.id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" style={{ textAlign: 'center', fontWeight: 'bold', color: 'red' }}>
                Sorry, the data doesn't exist.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      
      {/* Modal for Adding/Editing Student */}
      {showModal && (
        <div className="modal">
          <form onSubmit={handleSubmit}>
            <h2>{isEditing ? 'Edit Student' : 'Add Student'}</h2>
            <input type="text" name="id" placeholder="ID" value={formData.id} onChange={handleChange} required disabled={isEditing} />
            <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
            <input type="text" name="course" placeholder="Course" value={formData.course} onChange={handleChange} required />
            <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} required />
            <select name="gender" value={formData.gender} onChange={handleChange} required>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
            <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <button type="submit">{isEditing ? 'Update Student' : 'Add Student'}</button>
            <button type="button" onClick={resetForm}>Cancel</button>
          </form>
        </div>
      )}
      
      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default ManageStudents;
