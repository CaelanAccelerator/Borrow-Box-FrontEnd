import axios from 'axios';

// 云端上传配置
const CLOUDINARY_CONFIG = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'caelanzhouubc',
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'caelanzhouUBCupload',
  apiUrl: `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'caelanzhouubc'}/image/upload`,
};



// 批量上传图片
export const uploadMultipleImages = async (files: File[]): Promise<string[]> => {

  //helper function to upload a single image
  async function uploadImageToCloud(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
  try {
    console.log('📤 Uploading image to cloud...');
    const response = await axios.post(CLOUDINARY_CONFIG.apiUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('✅ Image uploaded successfully:', response.data.secure_url);
    return response.data.secure_url;
  } catch (error) {
    console.error('❌ Error uploading image to cloud:', error);
    throw new Error('Failed to upload image to cloud');
  }
};

  console.log(`📤 Starting batch upload of ${files.length} images...`);
  
  try {
    const uploadPromises = files.map((file, index) => {
      console.log(`📤 Uploading image ${index + 1}/${files.length}: ${file.name}`);
      return uploadImageToCloud(file);
    });
    
    const urls = await Promise.all(uploadPromises);
    console.log('✅ All images uploaded successfully:', urls);
    return urls;
  } catch (error) {
    console.error('❌ Error in batch upload:', error);
    throw new Error('Failed to upload one or more images');
  }
};

// Validate multiple images
export const validateMultipleImages = (files: File[]): { isValid: boolean; errors: string[] } => {
  // Helper function to validate a single file
  function validateImageFile(file: File): { isValid: boolean; error?: string } {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
      error: 'Only JPEG, PNG, GIF and WebP images are allowed',
    };
  }
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'Image size must be less than 5MB',
    };
  }
  return { isValid: true };
};
  const errors: string[] = [];
  
  files.forEach((file, index) => {
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      errors.push(`File ${index + 1} (${file.name}): ${validation.error}`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

// 从云端删除图片 (可选功能)
export const deleteImageFromCloud = async (imageUrl: string): Promise<boolean> => {
  try {
    // 从URL中提取public_id
    const publicId = extractPublicIdFromUrl(imageUrl);
    
    // 注意：删除功能需要后端支持，因为需要API secret
    // 这里只是示例，实际应该通过后端API调用
    console.log('🗑️ Delete request for public_id:', publicId);
    
    // 实际调用应该是：
    // await axios.delete('/api/delete-image', { data: { publicId } });
    
    return true;
  } catch (error) {
    console.error('❌ Error deleting image:', error);
    return false;
  }
};

// 辅助函数：从URL提取public_id
const extractPublicIdFromUrl = (url: string): string => {
  const parts = url.split('/');
  const filename = parts[parts.length - 1];
  return filename.split('.')[0];
};

// 获取优化的图片URL (可选功能)
export const getOptimizedImageUrl = (originalUrl: string, options?: {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'auto' | 'jpg' | 'png' | 'webp';
}): string => {
  if (!originalUrl.includes('cloudinary.com')) {
    return originalUrl;
  }
  
  const { width, height, quality = 80, format = 'auto' } = options || {};
  
  const transformations = [];
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  transformations.push(`q_${quality}`);
  transformations.push(`f_${format}`);
  
  const transformation = transformations.join(',');
  
  // 在URL中插入转换参数
  return originalUrl.replace('/upload/', `/upload/${transformation}/`);
};