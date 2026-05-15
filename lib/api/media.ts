export interface MediaFile {
  name: string;
  url: string;
  key: string;
  size: number;
  lastModified: string;
}

export const mediaAPI = {
  upload: async (file: File): Promise<{ url: string; key: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/uploads`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });
    if (!response.ok) throw new Error('Upload failed');
    return response.json();
  },

  list: async (): Promise<MediaFile[]> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/uploads`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to list media');
    return response.json();
  },
};
