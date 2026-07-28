import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      default: 'Untitled Resume',
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      default: {},
    },
    theme: {
      type: String,
      required: true,
      default: 'modern',
    },
    accent_color: {
      type: String,
      required: true,
      default: '#2563eb',
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

// Transform the output object to match frontend expected types (e.g. mapping _id to id)
resumeSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Resume = mongoose.model('Resume', resumeSchema);
export default Resume;
