import mongoose from 'mongoose';

const { Schema } = mongoose;

const warnSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  moderatorId: {
    type: String,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
});

export default mongoose.model('warns', warnSchema);
