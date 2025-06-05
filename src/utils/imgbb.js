/**
 * Xtreme Serverless OOB - imgBB Integration
 * Developed by p0intsec (06/2025)
 * MIT Licensed
 */

import axios from 'axios';

export async function captureScreenshot(url, apiKey) {
  if (!apiKey) {
    console.error('imgBB API key not configured');
    return null;
  }

  try {
    const formData = new FormData();
    formData.append('image', url);
    
    const response = await axios.post(`https://api.imgbb.com/1/upload?key=${apiKey}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data.data.url;
  } catch (error) {
    console.error('Screenshot capture failed:', error);
    return null;
  }
}
