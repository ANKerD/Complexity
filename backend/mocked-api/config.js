const config = {
  port: process.env.PORT || 3030,
  jwt_secret: process.env.JWT_SECRET || 'jason-uebi-toquen',
  supportedLangs: ['py2', 'py3', 'cpp']
}

if (process.env.SUPPORTED_LANGS) {
  config.supportedLangs = JSON.parse(process.env.SUPPORTED_LANGS);
}

module.exports = config;