export function downloadFile(base64String: string, fileName: string = 'download.xlsx', mimeType: string = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    const byteArray = new Uint8Array([...atob(base64String)].map(char => char.charCodeAt(0)));
    const blob = new Blob([byteArray], { type: mimeType });
  
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  }
  
export function fileToBase64(file: File): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1]; // ✅ Extract only base64 content
      resolve(base64);
    };

    reader.onerror = error => reject(error);
  });
}

export function downloadBlobFile(blob: Blob, fileName: string) {
  const a = document.createElement('a');
  const url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
}
