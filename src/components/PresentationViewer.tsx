import { useState, useRef, useEffect } from 'react';
import {
  getPresentationUrlInfo,
  PresentationUrlInfo,
  getGoogleSlidesSlideshowLink,
  getGoogleSlidesViewLink,
} from '@/utils/pptUtils';
import {
  ExternalLink,
  AlertTriangle,
  FileText,
  Play,
  Eye,
  Maximize,
} from 'lucide-react';

interface PresentationViewerProps {
  url: string;
  className?: string;
  showControls?: boolean;
  autoStart?: boolean;
  loop?: boolean;
}

export function PresentationViewer({
  url,
  className = '',
  showControls = true,
  autoStart = false,
  loop = false,
}: PresentationViewerProps) {
  const [slideshowMode, setSlideshowMode] = useState(autoStart);
  const containerRef = useRef<HTMLDivElement>(null);

  // Prevent unwanted scrolling behavior when navigating presentation
  useEffect(() => {
    const handleFocus = (e: FocusEvent) => {
      // Prevent automatic scrolling when iframe gets focus
      if (e.target && (e.target as Element).tagName === 'IFRAME') {
        e.preventDefault();
      }
    };

    const handleScroll = (e: Event) => {
      // If the scroll is triggered by iframe interaction, prevent it
      if (
        containerRef.current &&
        containerRef.current.contains(e.target as Node)
      ) {
        const container = containerRef.current;
        const rect = container.getBoundingClientRect();

        // If container is already in view, prevent additional scrolling
        if (rect.top >= -100 && rect.top <= window.innerHeight / 2) {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    };

    document.addEventListener('focus', handleFocus, true);
    document.addEventListener('scroll', handleScroll, true);

    return () => {
      document.removeEventListener('focus', handleFocus, true);
      document.removeEventListener('scroll', handleScroll, true);
    };
  }, []);

  if (!url) {
    return (
      <div
        className={`w-full aspect-[4/3] bg-gray-100 rounded-lg flex items-center justify-center ${className}`}
      >
        <div className='text-center text-gray-500'>
          <FileText className='w-12 h-12 mx-auto mb-2 opacity-50' />
          <p>No presentation available</p>
        </div>
      </div>
    );
  }

  const presentationInfo: PresentationUrlInfo = getPresentationUrlInfo(url);

  // Handle Google Slides URLs
  if (presentationInfo.type === 'google_slides' && presentationInfo.embedUrl) {
    const embedUrl = slideshowMode
      ? `${presentationInfo.embedUrl}&start=true&loop=${loop}&delayms=5000`
      : presentationInfo.embedUrl;

    return (
      <div
        ref={containerRef}
        className={`w-full bg-white rounded-lg border border-gray-200 overflow-hidden ${className}`}
        style={{ scrollBehavior: 'smooth' }}
      >
        {showControls && (
          <div className='bg-gray-50 px-4 py-3 border-b flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <FileText className='w-5 h-5 text-gray-600' />
              <span className='text-sm font-medium text-gray-700'>
                Google Slides Presentation
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <button
                onClick={() => setSlideshowMode(!slideshowMode)}
                className={`inline-flex items-center gap-1 px-3 py-1 rounded text-sm font-medium transition-colors ${
                  slideshowMode
                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                title={
                  slideshowMode ? 'Exit slideshow mode' : 'Enter slideshow mode'
                }
              >
                {slideshowMode ? (
                  <Eye className='w-4 h-4' />
                ) : (
                  <Play className='w-4 h-4' />
                )}
                {slideshowMode ? 'View Mode' : 'Slideshow'}
              </button>
              <a
                href={getGoogleSlidesViewLink(url)}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 hover:bg-green-200 rounded text-sm font-medium transition-colors'
                title='Open in Google Slides'
              >
                <ExternalLink className='w-4 h-4' />
                Open
              </a>
              <a
                href={getGoogleSlidesSlideshowLink(url)}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 hover:bg-purple-200 rounded text-sm font-medium transition-colors'
                title='Open slideshow in new window'
              >
                <Maximize className='w-4 h-4' />
                Fullscreen
              </a>
            </div>
          </div>
        )}
        <div className='w-full aspect-[4/3] bg-gray-50'>
          <iframe
            src={embedUrl}
            width='100%'
            height='100%'
            allowFullScreen
            frameBorder='0'
            title='Google Slides Presentation'
            className='w-full h-full'
            style={{
              border: 'none',
              pointerEvents: 'auto',
              touchAction: 'auto',
            }}
            onLoad={e => {
              // Prevent iframe from triggering parent scroll
              const iframe = e.target as HTMLIFrameElement;
              iframe.style.scrollBehavior = 'auto';
            }}
          />
        </div>
      </div>
    );
  }

  // Handle Google Drive PowerPoint files
  if (
    presentationInfo.type === 'google_drive_ppt' &&
    presentationInfo.embedUrl
  ) {
    return (
      <div
        ref={containerRef}
        className={`w-full bg-white rounded-lg border border-gray-200 overflow-hidden ${className}`}
        style={{ scrollBehavior: 'smooth' }}
      >
        {showControls && (
          <div className='bg-gray-50 px-4 py-3 border-b flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <FileText className='w-5 h-5 text-gray-600' />
              <span className='text-sm font-medium text-gray-700'>
                PowerPoint Presentation
              </span>
            </div>
            <a
              href={url}
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded text-sm font-medium transition-colors'
            >
              <ExternalLink className='w-4 h-4' />
              Open in Google Drive
            </a>
          </div>
        )}
        <div className='w-full aspect-[4/3] bg-gray-50'>
          <iframe
            src={presentationInfo.embedUrl}
            width='100%'
            height='100%'
            allowFullScreen
            frameBorder='0'
            title='PowerPoint Presentation'
            className='w-full h-full'
            style={{
              border: 'none',
              pointerEvents: 'auto',
              touchAction: 'auto',
            }}
            onLoad={e => {
              // Prevent iframe from triggering parent scroll
              const iframe = e.target as HTMLIFrameElement;
              iframe.style.scrollBehavior = 'auto';
            }}
          />
        </div>
      </div>
    );
  }

  // Handle unsupported/unknown URLs
  return (
    <div
      className={`w-full aspect-[4/3] bg-gray-50 rounded-lg border border-gray-200 ${className}`}
    >
      <div className='h-full flex flex-col items-center justify-center p-6'>
        <AlertTriangle className='w-16 h-16 text-amber-500 mb-4' />
        <h3 className='text-lg font-semibold text-gray-900 mb-2'>
          Unsupported Presentation Format
        </h3>
        <p className='text-gray-600 text-center mb-4'>
          This presentation format is not supported for direct embedding. You
          can try opening it directly.
        </p>
        <a
          href={url}
          target='_blank'
          rel='noopener noreferrer'
          className='inline-flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors'
        >
          <ExternalLink className='w-4 h-4' />
          Open Original Link
        </a>
      </div>
    </div>
  );
}
