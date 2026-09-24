const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function uploadImage(file) {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_URL}/api/process-latex`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    return { error: 'Failed to process image' };
  }
}