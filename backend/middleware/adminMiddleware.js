function adminMiddleware(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      message:
        'برای دسترسی به این بخش باید وارد حساب شوید.',
    })
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      message:
        'شما اجازه دسترسی به پنل مدیریت را ندارید.',
    })
  }

  return next()
}

module.exports = adminMiddleware