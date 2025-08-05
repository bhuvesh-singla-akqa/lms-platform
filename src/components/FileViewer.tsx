import { getVideoUrlInfo } from '@/utils/videoUtils';
import { getPresentationUrlInfo } from '@/utils/pptUtils';
import { ExternalLink } from 'lucide-react';

type FileViewerProps = {
  url?: string;
};

function isGoogleDriveLink(url: string): boolean {
  return url.includes('drive.google.com');
}

function isPDF(url: string): boolean {
  return url.toLowerCase().includes('.pdf') || url.includes('application/pdf');
}

export const FileViewer: React.FC<FileViewerProps> = ({ url }) => {
  if (!url) {
    return (
      <div className='w-full h-40 flex items-center justify-center bg-gray-100 rounded'>
        <span className='text-gray-400'>No file uploaded</span>
      </div>
    );
  }

  const videoInfo = getVideoUrlInfo(url);
  const presentationInfo = getPresentationUrlInfo(url);

  // Google Slides preview (use presentation utility for better handling)
  if (
    url.includes('docs.google.com/presentation') ||
    presentationInfo.type === 'google_slides'
  ) {
    const embedUrl = presentationInfo.embedUrl || url;
    return (
      <div className='w-full'>
        <div className='flex items-center justify-between mb-2'>
          <span className='text-gray-700 font-medium'>
            Google Slides Preview
          </span>
          <a
            href={url}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm'
          >
            <ExternalLink className='w-4 h-4' />
            Open in Google Slides
          </a>
        </div>
        <div className='w-full h-[600px] bg-gray-100 rounded-lg overflow-hidden'>
          <iframe
            src={embedUrl}
            frameBorder='0'
            width='100%'
            height='100%'
            allowFullScreen
            title='Google Slides Preview'
          />
        </div>
      </div>
    );
  }

  // Google Drive file preview
  if (isGoogleDriveLink(url)) {
    return (
      <div className='w-full'>
        <div className='flex items-center justify-between mb-2'>
          <span className='text-gray-700 font-medium'>File Preview</span>
          <a
            href={url}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm'
          >
            <ExternalLink className='w-4 h-4' />
            Open in Google Drive
          </a>
        </div>
        <div className='w-full h-[600px] bg-gray-100 rounded-lg overflow-hidden'>
          <iframe
            src={videoInfo.embedUrl || url}
            frameBorder='0'
            width='100%'
            height='100%'
            allowFullScreen
            title='Google Drive Preview'
          />
        </div>
      </div>
    );
  }

  // PDF preview
  if (isPDF(url)) {
    return (
      <div className='w-full'>
        <div className='flex items-center justify-between mb-2'>
          <span className='text-gray-700 font-medium'>PDF Preview</span>
          <a
            href={url}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm'
          >
            <ExternalLink className='w-4 h-4' />
            Download
          </a>
        </div>
        <div className='w-full h-[600px] bg-gray-100 rounded-lg overflow-hidden'>
          <embed
            src={url}
            type='application/pdf'
            width='100%'
            height='100%'
            className='w-full h-full'
          />
        </div>
      </div>
    );
  }

  // Fallback for other file types
  return (
    <div className='w-full'>
      <div className='flex items-center justify-between mb-2'>
        <span className='text-gray-700 font-medium'>File</span>
        <a
          href={url}
          target='_blank'
          rel='noopener noreferrer'
          className='inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm'
        >
          <ExternalLink className='w-4 h-4' />
          Open File
        </a>
      </div>
      <div className='w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center'>
        <div className='text-center text-gray-500'>
          <p>File preview not available</p>
          <p className='text-sm'>Click &quot;Open File&quot; to view</p>
        </div>
      </div>
    </div>
  );
};
