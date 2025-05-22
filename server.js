require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB 연결 성공'))
  .catch((err) => console.error('MongoDB 연결 실패:', err));

const studentSchema = new mongoose.Schema({
  name: String,
  id: Number,
});
const attendanceSchema = new mongoose.Schema({
  name: String,
  date: Date,
  status: String,
  firstClickTime: Date,
});
const Student = mongoose.model('Student', studentSchema);
const Attendance = mongoose.model('Attendance', attendanceSchema);

// 학생 추가
app.post('/students', async (req, res) => {
  const { name, id } = req.body;
  const student = new Student({ name, id });
  await student.save();
  res.json(student);
});

// 학생 목록 조회
app.get('/students', async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

// 출석 기록 추가
app.post('/attendances', async (req, res) => {
  const { name, date, status, firstClickTime } = req.body;
  const attendance = new Attendance({ name, date, status, firstClickTime });
  await attendance.save();
  res.json(attendance);
});

// 출석 기록 조회
app.get('/attendances', async (req, res) => {
  const attendances = await Attendance.find();
  res.json(attendances);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 