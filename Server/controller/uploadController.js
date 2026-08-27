const { uploadBuffer } = require('../services/cloudinaryService');

const uploadAsset = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const result = await uploadBuffer(req.file, `pathseeker/${req.body.folder || 'assets'}`);
    res.status(201).json({
      message: 'File uploaded successfully',
      url: result.secure_url,
      publicId: result.public_id,
      resourceType: result.resource_type,
      format: result.format,
      bytes: result.bytes
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error.message);
    res.status(502).json({ message: 'Cloudinary upload failed' });
  }
};

module.exports = { uploadAsset };
