import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Resume from './models/Resume.js';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5001;
const mongodbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/resumeforge';

// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(mongodbUri)
  .then(() => console.log('Connected to MongoDB successfully.'))
  .catch((err) => console.error('MongoDB connection error:', err));

// API Routes

// Get all resumes sorted by updated_at descending
app.get('/api/resumes', async (req, res) => {
  try {
    const resumes = await Resume.find().sort({ updated_at: -1 });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single resume by ID
app.get('/api/resumes/:id', async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    res.json(resume);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new resume
app.post('/api/resumes', async (req, res) => {
  try {
    const { title, data, theme, accent_color } = req.body;
    const resume = new Resume({
      title,
      data,
      theme,
      accent_color,
    });
    const savedResume = await resume.save();
    res.status(201).json(savedResume);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update an existing resume
app.put('/api/resumes/:id', async (req, res) => {
  try {
    const { title, data, theme, accent_color } = req.body;
    const updatedResume = await Resume.findByIdAndUpdate(
      req.params.id,
      {
        title,
        data,
        theme,
        accent_color,
      },
      { new: true } // Return the modified document rather than original
    );
    if (!updatedResume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    res.json(updatedResume);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a resume
app.delete('/api/resumes/:id', async (req, res) => {
  try {
    const deletedResume = await Resume.findByIdAndDelete(req.params.id);
    if (!deletedResume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start Express Server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
