 const adminOnly = (req, res, next) => {
  console.log("ADMIN CHECK - req.user is:", req.user);
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as admin' });
  }
};

export default adminOnly; 
