const multer = require('multer')
const path = require('path')
const fs = require('fs')

// ====================
// Upload Directories
// ====================

const uploadsDirectory = path.join(
  __dirname,
  '..',
  'uploads',
)

const originalUploadDirectory =
  path.join(
    uploadsDirectory,
    'original',
  )

const editedUploadDirectory =
  path.join(
    uploadsDirectory,
    'edited',
  )

// ====================
// Create Upload Directories
// ====================

function createUploadDirectories() {
  const directories = [
    originalUploadDirectory,
    editedUploadDirectory,
  ]

  directories.forEach((directory) => {
    fs.mkdirSync(directory, {
      recursive: true,
    })
  })
}

createUploadDirectories()

// ====================
// Generate File Name
// ====================

function generateFileName(
  originalName,
) {
  const extension =
    path.extname(originalName)

  return `${Date.now()}-${Math.round(
    Math.random() * 1e9,
  )}${extension}`
}

// ====================
// Multer Storage
// ====================

const storage =
  multer.diskStorage({
    destination: (
      req,
      file,
      callback,
    ) => {
      callback(
        null,
        originalUploadDirectory,
      )
    },

    filename: (
      req,
      file,
      callback,
    ) => {
      callback(
        null,
        generateFileName(
          file.originalname,
        ),
      )
    },
  })

// ====================
// Multer Upload
// ====================

const upload =
  multer({
    storage,
  })

module.exports = {
  upload,
  originalUploadDirectory,
  editedUploadDirectory,
}