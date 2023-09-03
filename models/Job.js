const { Schema, model } = require('mongoose');

const jobSchema = new Schema(
  {
    company: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'interview', 'declined'],
        message: '{VALUE} is not supported',
      },
      default: 'pending',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = model('Job', jobSchema);
