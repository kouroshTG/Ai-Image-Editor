const mongoose = require('mongoose')

// ====================
// Connect Database
// ====================

async function connectDatabase() {
  console.log(
    'Starting database connection...',
  )

  if (!process.env.MONGO_URI) {
    throw new Error(
      'MONGO_URI is not defined in .env',
    )
  }

  try {
    await mongoose.connect(
      process.env.MONGO_URI,
      {
        serverSelectionTimeoutMS: 5000,
      },
    )

    console.log(
      'MongoDB connected successfully',
    )
  } catch (error) {
    console.error(
      'MongoDB connection error:',
      error.message,
    )

    throw error
  }
}

module.exports =
  connectDatabase