require('dotenv').config()

const app =
  require('./app')

const connectDatabase =
  require('./config/database')

const PORT =
  process.env.PORT || 5000

const HOST =
  process.env.HOST || '0.0.0.0'

// ====================
// Start Server
// ====================

async function startServer() {
  try {
    await connectDatabase()

    app.listen(
      PORT,
      HOST,
      () => {
        console.log(
          `Server running on ${HOST}:${PORT}`,
        )
      },
    )
  } catch (error) {
    console.error(
      'Failed to start server:',
      error.message,
    )

    process.exit(1)
  }
}

startServer()