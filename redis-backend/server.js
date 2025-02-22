const express = require('express');
const redis = require('redis');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to Redis
const client = redis.createClient({
  url: 'redis://@127.0.0.1:6379', // Default Redis connection
});

client.connect()
  .then(() => console.log('Connected to Redis'))
  .catch((err) => console.error('Redis connection error:', err));

// CRUD Operations

// Route to save student data
app.post('/students', async (req, res) => {
  const { id, name, course, age, gender, address, email, phone, status } = req.body;

  if (!id || !name || !course || !age || !gender || !address || !email || !phone || !status) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    await client.hSet(`student:${id}`, 'name', name);
    await client.hSet(`student:${id}`, 'course', course);
    await client.hSet(`student:${id}`, 'age', age);
    await client.hSet(`student:${id}`, 'gender', gender);
    await client.hSet(`student:${id}`, 'address', address);
    await client.hSet(`student:${id}`, 'email', email);
    await client.hSet(`student:${id}`, 'phone', phone);
    await client.hSet(`student:${id}`, 'status', status);

    res.status(201).json({ message: 'Student saved successfully' });
  } catch (error) {
    console.error('Error saving student:', error);
    res.status(500).json({ message: 'Failed to save student' });
  }
});

app.post("/upload-csv", async (req, res) => {
  const { data } = req.body;
  if (!data || !Array.isArray(data)) {
    return res.status(400).json({ message: "Invalid CSV data" });
  }

  try {
    for (let i = 0; i < data.length; i++) {
      const student = data[i];
      const id = student.id || `csv_${i}`;

      await client.hSet(`student:${id}`, {
        name: student.name || "Unknown",
        course: student.course || "Unknown",
        age: student.age || "Unknown",
        gender: student.gender || "Unknown",
        address: student.address || "Unknown",
        email: student.email || "Unknown",
        phone: student.phone || "Unknown",
        status: student.status || "Inactive",
      });
    }

    res.json({ message: "CSV data uploaded successfully" });
  } catch (error) {
    console.error("Error saving CSV data:", error);
    res.status(500).json({ message: "Failed to store CSV data" });
  }
});



// Route to get all students with optional search
app.get('/students', async (req, res) => {
  const { search } = req.query;
  try {
    const keys = await client.keys('student:*');
    let students = await Promise.all(
      keys.map(async (key) => {
        return { id: key.split(':')[1], ...(await client.hGetAll(key)) };
      })
    );

    if (search) {
      students = students.filter((student) =>
        Object.values(student).some((value) =>
          String(value).toLowerCase().includes(search.toLowerCase())
        )
      );
    }

    res.json(students);
  } catch (error) {
    console.error('Error retrieving students:', error);
    res.status(500).json({ message: 'Failed to retrieve students' });
  }
});

// Route to get a single student by ID
app.get('/students/:id', async (req, res) => {
  const id = req.params.id;
  const student = await client.hGetAll(`student:${id}`);
  if (Object.keys(student).length === 0) {
    return res.status(404).json({ message: 'Student not found' });
  }
  res.json(student);
});

// Route to get all students with optional search
app.get('/students', async (req, res) => {
  const { search } = req.query;
  try {
    const keys = await client.keys('student:*');
    let students = await Promise.all(
      keys.map(async (key) => {
        return { id: key.split(':')[1], ...(await client.hGetAll(key)) };
      })
    );

    if (search) {
      const searchLower = search.toLowerCase();
      students = students.filter((student) =>
        Object.entries(student).some(([key, value]) =>
          key !== 'id' && String(value).toLowerCase().includes(searchLower)
        )
      );
    }

    res.json(students);
  } catch (error) {
    console.error('Error retrieving students:', error);
    res.status(500).json({ message: 'Failed to retrieve students' });
  }
});


// Route to update a student by ID
app.put('/students/:id', async (req, res) => {
  const id = req.params.id;
  const { name, course, age, gender, address, email, phone, status } = req.body;

  try {
    const existingStudent = await client.hGetAll(`student:${id}`);
    if (Object.keys(existingStudent).length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (name) await client.hSet(`student:${id}`, 'name', name);
    if (course) await client.hSet(`student:${id}`, 'course', course);
    if (age) await client.hSet(`student:${id}`, 'age', age);
    if (gender) await client.hSet(`student:${id}`, 'gender', gender);
    if (address) await client.hSet(`student:${id}`, 'address', address);
    if (email) await client.hSet(`student:${id}`, 'email', email);
    if (phone) await client.hSet(`student:${id}`, 'phone', phone);
    if (status) await client.hSet(`student:${id}`, 'status', status);

    res.status(200).json({ message: 'Student updated successfully' });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ message: 'Failed to update student' });
  }
});


// Route to delete a student by ID
app.delete('/students/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await client.del(`student:${id}`);
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ message: 'Failed to delete student' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

