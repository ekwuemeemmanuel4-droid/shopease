import jwt from 'jsonwebtoken';

 const protect = (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    console.log("RECEIVED TOKEN:", token);
     console.log("VERIFY SECRET:", process.env.JWT_SECRET);
   const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.user = decoded; // or req.user = await User.findById(decoded.id)
   req.user = decoded;
console.log("REQ.USER SET TO:", req.user);

next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

export default protect;