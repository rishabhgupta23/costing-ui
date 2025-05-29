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

// If you want to keep this as a utility function, rename it to avoid conflict and remove 'this.'
export function base64ToFile(partService: any, fileUrl: string) {
  partService.downloadPartFile(fileUrl).subscribe((response: Blob) => {
    if (response instanceof Blob) {
      const fileName = fileUrl.split('/').pop() || 'downloaded-file.png'; // Ensure correct file extension
      const a = document.createElement('a');
      const url = window.URL.createObjectURL(response);
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    } else {
      console.error('Unexpected response format:', response);
    }
  });
}
