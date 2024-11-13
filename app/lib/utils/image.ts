import { unlink } from 'fs/promises';
import { join } from 'path';

export async function deleteImage(imagePath: string) {
  try {
    if (!imagePath) return;

    // Extract filename from path
    const fileName = imagePath.split('/').pop();
    if (!fileName) return;

    const fullPath = join(process.cwd(), 'public/uploads', fileName);
    await unlink(fullPath);
    console.log(`Successfully deleted image: ${fullPath}`);
  } catch (error) {
    console.error('Error deleting image:', error);
  }
} 