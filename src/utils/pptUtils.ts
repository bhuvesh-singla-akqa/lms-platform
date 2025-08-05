/**
 * Utility functions for handling presentation URLs, especially Google Slides URLs
 */

export interface PresentationUrlInfo {
  url: string;
  type: 'google_slides' | 'google_drive_ppt' | 'direct_ppt' | 'unknown';
  isEmbeddable: boolean;
  embedUrl?: string;
  originalUrl: string;
  presentationId?: string;
}

/**
 * Analyzes and converts presentation URLs to embeddable formats
 */
export function getPresentationUrlInfo(inputUrl: string): PresentationUrlInfo {
  if (!inputUrl || typeof inputUrl !== 'string') {
    return {
      url: '',
      type: 'unknown',
      isEmbeddable: false,
      originalUrl: inputUrl || '',
    };
  }

  const trimmedUrl = inputUrl.trim();

  // Google Slides URL: https://docs.google.com/presentation/d/PRESENTATION_ID/edit or view
  const googleSlidesMatch = trimmedUrl.match(
    /docs\.google\.com\/presentation\/d\/([a-zA-Z0-9-_]+)/
  );
  if (googleSlidesMatch) {
    const presentationId = googleSlidesMatch[1];
    return {
      url: trimmedUrl,
      type: 'google_slides',
      isEmbeddable: true,
      embedUrl: `https://docs.google.com/presentation/d/${presentationId}/embed?start=false&loop=false&delayms=5000`,
      originalUrl: trimmedUrl,
      presentationId,
    };
  }

  // Google Drive PowerPoint file URL: https://drive.google.com/file/d/FILE_ID/view
  const drivePptMatch = trimmedUrl.match(
    /drive\.google\.com\/file\/d\/([^/\?]+)/
  );
  if (
    drivePptMatch &&
    (trimmedUrl.includes('.ppt') ||
      trimmedUrl.includes('.pptx') ||
      trimmedUrl.includes('powerpoint'))
  ) {
    const fileId = drivePptMatch[1];
    return {
      url: trimmedUrl,
      type: 'google_drive_ppt',
      isEmbeddable: true,
      embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
      originalUrl: trimmedUrl,
      presentationId: fileId,
    };
  }

  // Direct PowerPoint file URLs
  const directPptMatch = trimmedUrl.match(/\.(ppt|pptx)(\?.*)?$/i);
  if (directPptMatch) {
    return {
      url: trimmedUrl,
      type: 'direct_ppt',
      isEmbeddable: false, // Most direct PPT files can't be embedded
      originalUrl: trimmedUrl,
    };
  }

  // Unknown/unsupported format
  return {
    url: trimmedUrl,
    type: 'unknown',
    isEmbeddable: false,
    originalUrl: trimmedUrl,
  };
}

/**
 * Converts Google Slides URLs to proper embed format
 */
export function convertGoogleSlidesUrl(url: string): string {
  const presentationInfo = getPresentationUrlInfo(url);

  if (presentationInfo.isEmbeddable && presentationInfo.embedUrl) {
    return presentationInfo.embedUrl;
  }

  return url;
}

/**
 * Extracts presentation ID from various Google Slides/Drive URL formats
 */
export function extractGooglePresentationId(url: string): string | null {
  if (!url) return null;

  // Google Slides URL format
  const slidesMatch = url.match(
    /docs\.google\.com\/presentation\/d\/([a-zA-Z0-9-_]+)/
  );
  if (slidesMatch) return slidesMatch[1];

  // Google Drive file URL format (for uploaded PPT files)
  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^/\?]+)/);
  if (driveMatch) return driveMatch[1];

  // Open URL format
  const openMatch = url.match(/docs\.google\.com\/open\?id=([^&]+)/);
  if (openMatch) return openMatch[1];

  return null;
}

/**
 * Creates a direct view link for Google Slides
 */
export function getGoogleSlidesViewLink(url: string): string {
  const presentationId = extractGooglePresentationId(url);
  if (presentationId) {
    return `https://docs.google.com/presentation/d/${presentationId}/view`;
  }
  return url;
}

/**
 * Creates slideshow mode link for Google Slides
 */
export function getGoogleSlidesSlideshowLink(url: string): string {
  const presentationId = extractGooglePresentationId(url);
  if (presentationId) {
    return `https://docs.google.com/presentation/d/${presentationId}/present`;
  }
  return url;
}

/**
 * Validates if a URL is likely to be a presentation
 */
export function isPresentationUrl(url: string): boolean {
  const presentationInfo = getPresentationUrlInfo(url);
  return presentationInfo.isEmbeddable;
}

/**
 * Gets presentation embed options with customizable parameters
 */
export function getGoogleSlidesEmbedUrl(
  url: string,
  options: {
    autoStart?: boolean;
    loop?: boolean;
    delayMs?: number;
    size?: 'small' | 'medium' | 'large';
  } = {}
): string {
  const { autoStart = false, loop = false, delayMs = 5000 } = options;
  const presentationId = extractGooglePresentationId(url);

  if (!presentationId) return url;

  const params = new URLSearchParams({
    start: autoStart.toString(),
    loop: loop.toString(),
    delayms: delayMs.toString(),
  });

  return `https://docs.google.com/presentation/d/${presentationId}/embed?${params.toString()}`;
}
