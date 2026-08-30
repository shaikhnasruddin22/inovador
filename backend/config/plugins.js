module.exports = ({ env }) => {
  const cloudinaryName = env('CLOUDINARY_NAME');
  const cloudinaryKey = env('CLOUDINARY_KEY');
  const cloudinarySecret = env('CLOUDINARY_SECRET');

  const hasCloudinary =
    cloudinaryName &&
    cloudinaryKey &&
    cloudinarySecret &&
    !cloudinaryName.toLowerCase().includes('your_cloudinary') &&
    !cloudinaryName.toLowerCase().includes('placeholder');

  if (hasCloudinary) {
    return {
      upload: {
        config: {
          provider: 'cloudinary',
          providerOptions: {
            cloud_name: cloudinaryName,
            api_key: cloudinaryKey,
            api_secret: cloudinarySecret,
          },
          actionOptions: {
            upload: {},
            uploadStream: {},
            delete: {},
          },
        },
      },
    };
  }

  // Fallback to local disk storage (works seamlessly on persistent VPS disk)
  return {
    upload: {
      config: {
        provider: 'local',
        sizeLimit: 50 * 1024 * 1024, // 50MB
      },
    },
  };
};
