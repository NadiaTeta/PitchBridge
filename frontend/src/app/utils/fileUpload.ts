import api from '../services/api';

export const uploadDocument = async (file: File, type: string): Promise<any> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);

  try {
    const response = await api.post('/upload/document', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response;
  } catch (error: any) {
    throw new Error(error.error || 'Upload failed');
  }
};

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.imageUrl;
  } catch (error: any) {
    throw new Error(error.error || 'Upload failed');
  }
};

export const uploadVideo = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('video', file);

  try {
    const response = await api.post('/upload/video', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.videoUrl;
  } catch (error: any) {
    throw new Error(error.error || 'Upload failed');
  }
};