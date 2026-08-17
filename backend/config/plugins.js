module.exports = ({ env }) => {
  const isProduction = env('NODE_ENV') === 'production';
  const cloudinaryName = env('CLOUDINARY_NAME');
  const cloudinaryKey = env('CLOUDINARY_KEY');
  const cloudinarySecret = env('CLOUDINARY_SECRET');

  if (cloudinaryName && cloudinaryKey && cloudinarySecret) {
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

  // In production, throw error if Cloudinary credentials are missing to prevent silent local storage loss
  if (isProduction) {
    throw new Error(
      'Production configuration error: CLOUDINARY_NAME, CLOUDINARY_KEY, and CLOUDINARY_SECRET must be set in production. Local disk uploads are forbidden in production serverless/container environments.'
    );
  }

  // Local development fallback
  return {
    upload: {
      config: {
        provider: 'local',
        sizeLimit: 10 * 1024 * 1024, // 10MB
      },
    },
  };
};
