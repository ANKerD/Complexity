const authenticate = (req, res, next) => {
  req.player = {
    email: 'hand@spinner.com',
    nick: 'hand',
    password: 'spinner'
  };
  next();
};


const authorize