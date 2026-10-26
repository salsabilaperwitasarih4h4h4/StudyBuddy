import { AttachedFile } from '../types';

// In-memory registry to hold live file Blobs and ObjectURLs
// This guarantees instantaneous attachment (0ms) and zero localStorage quota issues!
const fileBlobMap = new Map<string, { blob: Blob | File; objectUrl: string }>();

export const registerFile = (file: File): AttachedFile => {
  const id = 'file-' + Date.now() + '-' + Math.random().toString(36).substring(2, 8);
  const objectUrl = URL.createObjectURL(file);
  
  fileBlobMap.set(id, { blob: file, objectUrl });

  return {
    id,
    name: file.name,
    size: file.size,
    type: file.type || 'application/octet-stream',
    dataUrl: objectUrl
  };
};

export const getFileObjectUrl = (file: AttachedFile): string => {
  if (fileBlobMap.has(file.id)) {
    return fileBlobMap.get(file.id)!.objectUrl;
  }
  return file.dataUrl || '#';
};

export const downloadFileDirectly = (file: AttachedFile) => {
  const url = getFileObjectUrl(file);
  if (!url || url === '#') {
    alert('File tidak ditemukan di memori browser saat ini.');
    return;
  }
  const a = document.createElement('a');
  a.href = url;
  a.download = file.name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
