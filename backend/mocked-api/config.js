const config = {
  port: process.env.PORT || 3030,
  jwt_secret: process.env.JWT_SECRET || 'jason-uebi-toquen',
  supportedLangs: ['py2', 'py3', 'cpp'],
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUDNAME || 'duqthzynh',
    api_key: process.env.CLOUDINARY_APIKEY || '263833975991679',
    api_secret: process.env.CLOUDINARY_APISECRET || '9lFrHKDQcfL-eHdRj4bvjLmsz00',
  }
}

if (process.env.SUPPORTED_LANGS) {
  config.supportedLangs = JSON.parse(process.env.SUPPORTED_LANGS);
}

module.exports = config;