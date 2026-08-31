const jwt = require('jsonwebtoken')

function authMiddleware(
  req,
  res,
  next,
) {
  try {
    const token =
      req.cookies?.token

    if (!token) {
      return res.status(401).json({
        message:
          'برای دسترسی به این بخش باید وارد حساب شوید.',
      })
    }

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET,
      )

    req.user = decoded

    return next()
  } catch (error) {
    console.error(
      'Authentication error:',
      error.message,
    )

    return res.status(401).json({
      message:
        'نشست کاربری معتبر نیست. لطفاً دوباره وارد شوید.',
    })
  }
}

module.exports =
  authMiddleware