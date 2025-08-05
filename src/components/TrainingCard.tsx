import { useState } from 'react';
import { useRouter } from 'next/navigation';
import moment from 'moment';
import { Training } from '@/types';
import { createEvent } from 'ics';
import { saveAs } from 'file-saver';
import toast from 'react-hot-toast';
import { ChevronDown, Calendar, Download, ExternalLink } from 'lucide-react';

interface TrainingCardProps {
  training: Training;
  categoryColor?: string;
}

export function TrainingCard({
  training,
  categoryColor = 'bg-gray-100 text-gray-800',
}: TrainingCardProps) {
  const [showCalendarOptions, setShowCalendarOptions] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const router = useRouter();

  const isUpcoming = new Date(training.dateTime) > new Date();
  const formatDate = moment(training.dateTime).format('MMM DD, YYYY - h:mm A');

  const getCategoryDisplayName = (category: string) => {
    switch (category) {
      case 'FE':
        return 'Frontend';
      case 'BE':
        return 'Backend';
      case 'QA':
        return 'Quality Assurance';
      case 'General':
        return 'General';
      default:
        return category;
    }
  };

  const handleEnrollNow = () => {
    setShowCalendarOptions(!showCalendarOptions);
  };

  const handleICSDownload = async () => {
    setIsDownloading(true);

    try {
      const startDate = new Date(training.dateTime);
      const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // 2 hours duration

      const event = {
        title: training.title,
        description: `${training.description || 'Training session'}\n\nConducted by: ${training.conductedBy}\n\nMeeting Link: ${training.meetingLink || 'To be provided'}`,
        start: [
          startDate.getFullYear(),
          startDate.getMonth() + 1,
          startDate.getDate(),
          startDate.getHours(),
          startDate.getMinutes(),
        ] as [number, number, number, number, number],
        end: [
          endDate.getFullYear(),
          endDate.getMonth() + 1,
          endDate.getDate(),
          endDate.getHours(),
          endDate.getMinutes(),
        ] as [number, number, number, number, number],
        location: training.meetingLink || 'Online',
        url: training.meetingLink || '',
        organizer: {
          name: training.conductedBy,
          email: 'training@lms-platform.com',
        },
        productId: 'LMS-Platform',
        uid: `training-${training.id}-${Date.now()}`,
      };

      createEvent(event, (error, value) => {
        if (error) {
          console.error('Error creating calendar event:', error);
          toast.error('Failed to create calendar event');
          return;
        }

        // Create blob and download
        const blob = new Blob([value || ''], {
          type: 'text/calendar;charset=utf-8',
        });
        const fileName = `${training.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_training.ics`;
        saveAs(blob, fileName);

        // Show success message
        toast.success('Calendar event downloaded! 📅', {
          duration: 4000,
          position: 'top-center',
          style: {
            background: '#10B981',
            color: 'white',
            fontWeight: '600',
          },
        });
      });
    } catch (error) {
      console.error('Error enrolling in training:', error);
      toast.error('Failed to enroll in training');
    } finally {
      setIsDownloading(false);
      setShowCalendarOptions(false);
    }
  };

  const handleGoogleCalendar = () => {
    const startDate = new Date(training.dateTime);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

    // Format dates for Google Calendar (YYYYMMDDTHHMMSSZ)
    const formatGoogleDate = (date: Date) => {
      return date
        .toISOString()
        .replace(/[-:]/g, '')
        .replace(/\.\d{3}/, '');
    };

    const googleCalendarUrl = new URL(
      'https://calendar.google.com/calendar/render'
    );
    googleCalendarUrl.searchParams.set('action', 'TEMPLATE');
    googleCalendarUrl.searchParams.set('text', training.title);
    googleCalendarUrl.searchParams.set(
      'dates',
      `${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}`
    );
    googleCalendarUrl.searchParams.set(
      'details',
      `${training.description || 'Training session'}\n\nConducted by: ${training.conductedBy}\n\nMeeting Link: ${training.meetingLink || 'To be provided'}`
    );
    googleCalendarUrl.searchParams.set(
      'location',
      training.meetingLink || 'Online'
    );

    window.open(googleCalendarUrl.toString(), '_blank');
    setShowCalendarOptions(false);

    toast.success('Opening Google Calendar! 📅', {
      duration: 3000,
      position: 'top-center',
      style: {
        background: '#4285F4',
        color: 'white',
        fontWeight: '600',
      },
    });
  };

  const handleOutlookCalendar = () => {
    const startDate = new Date(training.dateTime);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

    // Format dates for Outlook (remove milliseconds and Z from ISO string)
    const formatOutlookDate = (date: Date) => {
      return date.toISOString().split('.')[0];
    };

    const outlookUrl = new URL(
      'https://outlook.office.com/calendar/deeplink/compose'
    );
    outlookUrl.searchParams.set('subject', training.title);
    outlookUrl.searchParams.set('startdt', formatOutlookDate(startDate));
    outlookUrl.searchParams.set('enddt', formatOutlookDate(endDate));
    outlookUrl.searchParams.set(
      'body',
      `${training.description || 'Training session'}\n\nConducted by: ${training.conductedBy}\n\nMeeting Link: ${training.meetingLink || 'To be provided'}`
    );
    outlookUrl.searchParams.set('location', training.meetingLink || 'Online');

    window.open(outlookUrl.toString(), '_blank');
    setShowCalendarOptions(false);

    toast.success('Opening Outlook Calendar! 📅', {
      duration: 3000,
      position: 'top-center',
      style: {
        background: '#0078D4',
        color: 'white',
        fontWeight: '600',
      },
    });
  };

  return (
    <div className='bg-white rounded-lg shadow-md p-6 flex flex-col h-full hover:shadow-lg transition-shadow'>
      <div className='flex-1'>
        <div className='mb-3'>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${categoryColor}`}
          >
            {getCategoryDisplayName(training.category)}
          </span>
        </div>

        <div className='mb-3'>
          <h3 className='font-bold text-lg text-gray-900 line-clamp-2'>
            {training.title}
          </h3>
        </div>

        <p className='text-gray-600 text-sm mb-4 line-clamp-3'>
          {training.description}
        </p>

        <div className='space-y-2 text-sm text-gray-500'>
          <div className='flex items-center'>
            <svg
              className='w-4 h-4 mr-2'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
              />
            </svg>
            {training.conductedBy}
          </div>

          <div className='flex items-center'>
            <svg
              className='w-4 h-4 mr-2'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
              />
            </svg>
            {formatDate}
          </div>

          {training.videoUrl && (
            <div className='flex items-center'>
              <svg
                className='w-4 h-4 mr-2'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z'
                />
              </svg>
              Video Available
            </div>
          )}

          {training.pptUrl && (
            <div className='flex items-center'>
              <svg
                className='w-4 h-4 mr-2'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                />
              </svg>
              Slides Available
            </div>
          )}
        </div>
      </div>

      <div className='mt-6 space-y-2'>
        <div className='flex gap-2'>
          {isUpcoming ? (
            <div className='flex-1'>
              <button
                onClick={handleEnrollNow}
                className='w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium text-center transition-colors flex items-center justify-center gap-2 whitespace-nowrap'
              >
                <Calendar size={16} />
                Enroll Now
                <ChevronDown
                  size={16}
                  className={`transition-transform ${showCalendarOptions ? 'rotate-180' : ''}`}
                />
              </button>
            </div>
          ) : null}

          <button
            onClick={() => router.push(`/training/${training.id}`)}
            className='px-4 py-2 border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 rounded-lg text-sm font-medium transition-colors'
          >
            Details
          </button>
        </div>
      </div>

      {/* Calendar Options Modal - Centered */}
      {showCalendarOptions && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'
          onClick={() => setShowCalendarOptions(false)}
        >
          <div
            className='bg-white rounded-lg shadow-xl p-6 max-w-sm mx-4 w-full'
            onClick={e => e.stopPropagation()}
          >
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-semibold text-gray-800'>
                Add to Calendar
              </h3>
              <button
                onClick={() => setShowCalendarOptions(false)}
                className='text-gray-400 hover:text-gray-600 transition-colors'
              >
                <svg
                  className='w-5 h-5'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            </div>

            <div className='space-y-3'>
              <button
                onClick={handleGoogleCalendar}
                className='w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors'
              >
                <div className='w-6 h-6 bg-blue-500 rounded flex items-center justify-center'>
                  <span className='text-white text-sm font-bold'>G</span>
                </div>
                <span className='font-medium'>Add to Google Calendar</span>
                <ExternalLink size={16} className='ml-auto text-gray-400' />
              </button>

              <button
                onClick={handleOutlookCalendar}
                className='w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors'
              >
                <div className='w-6 h-6 bg-blue-600 rounded flex items-center justify-center'>
                  <span className='text-white text-sm font-bold'>O</span>
                </div>
                <span className='font-medium'>Add to Outlook</span>
                <ExternalLink size={16} className='ml-auto text-gray-400' />
              </button>

              <button
                onClick={handleICSDownload}
                disabled={isDownloading}
                className='w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors disabled:opacity-50'
              >
                <Download size={18} className='text-gray-500' />
                <span className='font-medium'>
                  {isDownloading ? 'Downloading...' : 'Download .ics file'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
