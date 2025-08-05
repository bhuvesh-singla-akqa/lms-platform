import ReactPlayer from 'react-player';
import { getVideoUrlInfo, VideoUrlInfo } from '@/utils/videoUtils';
import { ExternalLink, AlertTriangle, Folder, Play } from 'lucide-react';

interface VideoPlayerProps {
  url: string;
  className?: string;
}

export function VideoPlayer({ url, className = '' }: VideoPlayerProps) {
  if (!url) {
    return (
      <div
        className={`w-full aspect-video bg-gray-100 rounded-lg flex items-center justify-center ${className}`}
      >
        <div className='text-center text-gray-500'>
          <Play className='w-12 h-12 mx-auto mb-2 opacity-50' />
          <p>No video available</p>
        </div>
      </div>
    );
  }

  const videoInfo: VideoUrlInfo = getVideoUrlInfo(url);

  // Handle Google Drive folder URLs - show a special interface
  if (videoInfo.type === 'drive_folder') {
    return (
      <div
        className={`w-full aspect-video bg-gray-50 rounded-lg border border-gray-200 ${className}`}
      >
        <div className='h-full flex flex-col items-center justify-center p-6'>
          <Folder className='w-16 h-16 text-blue-500 mb-4' />
          <h3 className='text-lg font-semibold text-gray-900 mb-2'>
            Google Drive Folder
          </h3>
          <p className='text-gray-600 text-center mb-6 max-w-md'>
            This is a Google Drive folder containing multiple files. Click below
            to view the folder contents in Google Drive.
          </p>
          <a
            href={url}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium'
          >
            <ExternalLink className='w-5 h-5' />
            Open Folder in Google Drive
          </a>
          <p className='text-sm text-gray-500 mt-4 text-center'>
            For direct video playback, use individual file URLs instead of
            folder URLs
          </p>
        </div>
      </div>
    );
  }

  // Handle Google Drive file URLs with iframe
  if (videoInfo.type === 'drive_file' && videoInfo.embedUrl) {
    return (
      <div
        className={`w-full aspect-video bg-black rounded-lg overflow-hidden ${className}`}
      >
        <iframe
          src={videoInfo.embedUrl}
          width='100%'
          height='100%'
          allow='autoplay; encrypted-media; fullscreen'
          allowFullScreen
          frameBorder='0'
          title='Google Drive Video'
          className='w-full h-full'
        />
      </div>
    );
  }

  // Handle unsupported/unknown URLs
  if (!videoInfo.isPlayable) {
    return (
      <div
        className={`w-full aspect-video bg-gray-50 rounded-lg border border-gray-200 ${className}`}
      >
        <div className='h-full flex flex-col items-center justify-center p-6'>
          <AlertTriangle className='w-16 h-16 text-amber-500 mb-4' />
          <h3 className='text-lg font-semibold text-gray-900 mb-2'>
            Unsupported Video Format
          </h3>
          <p className='text-gray-600 text-center mb-4'>
            This video format is not supported for direct playback. You can try
            opening it directly.
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

  // Use ReactPlayer for all other supported formats (YouTube, Vimeo, direct video files)
  return (
    <div
      className={`w-full aspect-video bg-black rounded-lg overflow-hidden ${className}`}
    >
      <ReactPlayer
        url={videoInfo.embedUrl || videoInfo.url}
        width='100%'
        height='100%'
        controls
        config={{
          youtube: {
            playerVars: { showinfo: 1 },
          },
          vimeo: {
            playerOptions: { responsive: true },
          },
        }}
        onError={error => {
          console.error('Video player error:', error);
        }}
      />
    </div>
  );
}
