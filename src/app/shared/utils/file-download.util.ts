export function downloadFile(base64String: string, fileName: string = 'download.xlsx', mimeType: string = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    const byteArray = new Uint8Array([...atob(base64String)].map(char => char.charCodeAt(0)));
    const blob = new Blob([byteArray], { type: mimeType });
  
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  }
  