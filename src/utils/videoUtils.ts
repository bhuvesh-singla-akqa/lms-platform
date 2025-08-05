/**
 * Utility functions for handling video URLs, especially Google Drive URLs
 */

export interface VideoUrlInfo {
  url: string;
  type:
    | 'drive_file'
    | 'drive_folder'
    | 'youtube'
    | 'vimeo'
    | 'direct'
    | 'unknown';
  isPlayable: boolean;
  embedUrl?: string;
  originalUrl: string;
}

/**
 * Analyzes and converts video URLs to playable formats
 */
export function getVideoUrlInfo(inputUrl: string): VideoUrlInfo {
  if (!inputUrl || typeof inputUrl !== 'string') {
    return {
      url: '',
      type: 'unknown',
      isPlayable: false,
      originalUrl: inputUrl || '',
    };
  }

  const trimmedUrl = inputUrl.trim();

  // Google Drive File URL: https://drive.google.com/file/d/FILE_ID/view
  const driveFileMatch = trimmedUrl.match(
    /drive\.google\.com\/file\/d\/([^/\?]+)/
  );
  if (driveFileMatch) {
    const fileId = driveFileMatch[1];
    return {
      url: trimmedUrl,
      type: 'drive_file',
      isPlayable: true,
      embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
      originalUrl: trimmedUrl,
    };
  }

  // Google Drive Folder URL: https://drive.google.com/drive/folders/FOLDER_ID
  const driveFolderMatch = trimmedUrl.match(
    /drive\.google\.com\/drive\/folders\/([^/\?]+)/
  );
  if (driveFolderMatch) {
    const folderId = driveFolderMatch[1];
    return {
      url: trimmedUrl,
      type: 'drive_folder',
      isPlayable: false, // Folders aren't directly playable
      embedUrl: `https://drive.google.com/embeddedfolderview?id=${folderId}#grid`,
      originalUrl: trimmedUrl,
    };
  }

  // YouTube URLs
  const youtubeMatch = trimmedUrl.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  );
  if (youtubeMatch) {
    return {
      url: trimmedUrl,
      type: 'youtube',
      isPlayable: true,
      embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}`,
      originalUrl: trimmedUrl,
    };
  }

  // Vimeo URLs
  const vimeoMatch = trimmedUrl.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return {
      url: trimmedUrl,
      type: 'vimeo',
      isPlayable: true,
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
      originalUrl: trimmedUrl,
    };
  }

  // Direct video file URLs
  const directVideoMatch = trimmedUrl.match(
    /\.(mp4|webm|ogg|mov|avi|mkv)(\?.*)?$/i
  );
  if (directVideoMatch) {
    return {
      url: trimmedUrl,
      type: 'direct',
      isPlayable: true,
      embedUrl: trimmedUrl,
      originalUrl: trimmedUrl,
    };
  }

  // Unknown/unsupported format
  return {
    url: trimmedUrl,
    type: 'unknown',
    isPlayable: false,
    originalUrl: trimmedUrl,
  };
}

/**
 * Converts Google Drive URLs to proper embed format
 */
export function convertGoogleDriveUrl(url: string): string {
  const videoInfo = getVideoUrlInfo(url);

  if (videoInfo.type === 'drive_file' && videoInfo.embedUrl) {
    return videoInfo.embedUrl;
  }

  if (videoInfo.type === 'drive_folder') {
    // For folders, we can't directly embed videos, but we can show the folder view
    console.warn(
      'Google Drive folder URL detected. This may contain multiple files and cannot be played directly as a video.'
    );
    return videoInfo.embedUrl || url;
  }

  return url;
}

/**
 * Extracts file ID from various Google Drive URL formats
 */
export function extractGoogleDriveFileId(url: string): string | null {
  if (!url) return null;

  // File URL format
  const fileMatch = url.match(/drive\.google\.com\/file\/d\/([^/\?]+)/);
  if (fileMatch) return fileMatch[1];

  // Folder URL format
  const folderMatch = url.match(
    /drive\.google\.com\/drive\/folders\/([^/\?]+)/
  );
  if (folderMatch) return folderMatch[1];

  // Open URL format
  const openMatch = url.match(/drive\.google\.com\/open\?id=([^&]+)/);
  if (openMatch) return openMatch[1];

  return null;
}

/**
 * Creates a direct download link for Google Drive files
 */
export function getGoogleDriveDirectLink(url: string): string {
  const fileId = extractGoogleDriveFileId(url);
  if (fileId) {
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  }
  return url;
}

/**
 * Validates if a URL is likely to be a video
 */
export function isVideoUrl(url: string): boolean {
  const videoInfo = getVideoUrlInfo(url);
  return videoInfo.isPlayable;
}
