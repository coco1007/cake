import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

const studentSchema = new mongoose.Schema({ name: String, id: Number });
const Student = mongoose.models.Student || mongoose.model('Student', studentSchema);

export default async function handler(req, res) {
  await mongoose.connect(MONGODB_URI);

  if (req.method === 'GET') {
    const students = await Student.find();
    res.status(200).json(students);
  } else if (req.method === 'POST') {
    const { name, id } = req.body;
    const student = new Student({ name, id });
    await student.save();
    res.status(201).json(student);
  } else {
    res.status(405).end();
  }
} 