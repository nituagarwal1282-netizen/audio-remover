
export const fileToBase64 = (file: File): Promise<{ data: string; mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const [meta, data] = result.split(',');
      if (!meta || !data) {
        return reject(new Error('Invalid file format for base64 conversion.'));
      }
      const mimeTypeMatch = meta.match(/:(.*?);/);
      const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : 'application/octet-stream';
      
      resolve({ data, mimeType });
    };
    reader.onerror = (error) => reject(error);
  });
};
