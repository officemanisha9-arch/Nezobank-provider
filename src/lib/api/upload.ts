// Read a File (image) from disk and return a base64 data URL.
// Replace with a real upload (presigned URL, multipart POST, etc.) later.

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
}
