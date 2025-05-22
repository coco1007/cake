import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

const attendanceSchema = new mongoose.Schema({
  id: Number,
  date: Date,
  name: String,
  status: String
});
const Attendance = mongoose.models.Attendance || mongoose.model('Attendance', attendanceSchema);

export default async function handler(req, res) {
  await mongoose.connect(MONGODB_URI);

  if (req.method === 'GET') {
    const attendances = await Attendance.find();
    res.status(200).json(attendances);
  } else if (req.method === 'POST') {
    const { id, date, name, status } = req.body;
    const attendance = new Attendance({ id, date, name, status });
    await attendance.save();
    res.status(201).json(attendance);
  } else {
    res.status(405).end();
  }
} 