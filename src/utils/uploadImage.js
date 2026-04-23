// const cloudinary = require('../config/cloudinary');

// const uploadImage = async (filePath, folder = 'apna-market') => {
//   try {
//     const result = await cloudinary.uploader.upload(filePath, {
//       folder,
//       quality: 'auto',
//       fetch_format: 'auto'
//     });

//     return {
//       success: true,
//       url: result.secure_url,
//       publicId: result.public_id
//     };

//   } catch (error) {
//     return {
//       success: false,
//       message: error.message
//     };
//   }
// };

// const deleteImage = async (publicId) => {
//   try {
//     await cloudinary.uploader.destroy(publicId);
//     return { success: true };
//   } catch (error) {
//     return { success: false, message: error.message };
//   }
// };

// module.exports = { uploadImage, deleteImage };






const cloudinary = require('../config/cloudinary');

const uploadImage = async (fileInput, folder = 'apna-market') => {
  try {
    let result;

    // ✅ Buffer hai (memoryStorage) ya file path hai — dono handle karo
    if (Buffer.isBuffer(fileInput)) {
      result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder, quality: 'auto', fetch_format: 'auto' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(fileInput);
      });
    } else {
      // file path string
      result = await cloudinary.uploader.upload(fileInput, {
        folder,
        quality: 'auto',
        fetch_format: 'auto'
      });
    }

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id
    };

  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
};

const deleteImage = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

module.exports = { uploadImage, deleteImage };