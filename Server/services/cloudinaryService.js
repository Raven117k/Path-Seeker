const { v2: cloudinary } = require('cloudinary');
const path = require('path');

function configureCloudinary() {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error('Cloudinary credentials are not configured');
  }

  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true
  });
}

function uploadBuffer(file, folder = 'pathseeker') {
  configureCloudinary();

  const resourceType = file.mimetype === 'application/pdf'
    ? 'raw'
    : file.mimetype.startsWith('image/')
      ? 'image'
      : 'video';

  const originalName = path.basename(file.originalname || 'asset');
  const safeBaseName = path.basename(originalName, path.extname(originalName)).replace(/[^a-zA-Z0-9_-]/g, '_') || 'asset';
  const extension = path.extname(originalName).toLowerCase();
  const uploadOptions = {
    folder,
    resource_type: resourceType,
    use_filename: resourceType !== 'raw',
    unique_filename: true,
    overwrite: false
  };

  if (resourceType === 'raw') {
    uploadOptions.public_id = `${safeBaseName}-${Date.now()}${extension}`;
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(uploadOptions,
    (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });

    stream.end(file.buffer);
  });
}

module.exports = { uploadBuffer };
