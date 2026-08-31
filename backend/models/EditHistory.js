const mongoose = require('mongoose')

const editHistorySchema =
  new mongoose.Schema(
    {
      userId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },

      originalImage: {
        type: String,
        required: true,
        trim: true,
      },

      originalFileName: {
        type: String,
        required: true,
        trim: true,
      },

      editedImage: {
        type: String,
        required: true,
        trim: true,
      },

      editedFileName: {
        type: String,
        required: true,
        trim: true,
      },

      prompt: {
        type: String,
        required: true,
        trim: true,
      },
    },
    {
      timestamps: true,
    },
  )

module.exports =
  mongoose.model(
    'EditHistory',
    editHistorySchema,
  )