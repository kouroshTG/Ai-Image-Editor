const express = require('express')
const cors = require('cors')
const path = require('path')
const cookieParser = require('cookie-parser')

const adminRoutes =
  require('./routes/adminRoutes')

const {
  notFoundHandler,
  errorHandler,
} =
  require('./middleware/errorMiddleware')

const authRoutes =
  require('./routes/authRoutes')

const imageRoutes =
  require('./routes/imageRoutes')

const userRoutes =
  require('./routes/userRoutes')

const uploadRoutes =
  require('./routes/uploadRoutes')

const historyRoutes =
  require('./routes/historyRoutes')

const generatePromptRouter =
  require('./routes/generatePrompt')

const app = express()

// ====================
// Middleware
// ====================

app.use(
  cors({
    origin:
      process.env.FRONTEND_URL,
    credentials: true,
  }),
)

app.use(express.json())
app.use(cookieParser())

// ====================
// Static Files
// ====================

const uploadsDirectory =
  path.join(
    __dirname,
    'uploads',
  )

app.use(
  '/uploads',
  express.static(
    uploadsDirectory,
  ),
)

// ====================
// Routes
// ====================

app.use(
  '/api/admin',
  adminRoutes,
)

app.use(
  '/api/edit-image',
  imageRoutes,
)

app.use(
  '/api/auth',
  authRoutes,
)

app.use(
  '/api/users',
  userRoutes,
)

app.use(
  '/api',
  uploadRoutes,
)

app.use(
  '/api/history',
  historyRoutes,
)

app.use(
  '/api/generate-prompt',
  generatePromptRouter,
)

// ====================
// Health Check
// ====================

app.get(
  '/',
  (req, res) => {
    res.status(200).json({
      message:
        'Backend is running',
    })
  },
)

// ====================
// Error Handling
// ====================

app.use(
  notFoundHandler,
)

app.use(
  errorHandler,
)

module.exports = app