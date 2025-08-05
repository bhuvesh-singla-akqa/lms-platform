'use client';

import { useState, useEffect, useCallback } from 'react';
import { Calendar, dateFnsLocalizer, View, Views } from 'react-big-calendar';
import {
  format,
  parse,
  startOfWeek,
  getDay,
  addYears,
  subYears,
  addMonths,
  subMonths,
} from 'date-fns';
import { enUS } from 'date-fns/locale';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface Training {
  id: string;
  title: string;
  description: string;
  category: 'FE' | 'BE' | 'QA' | 'General';
  conductedBy: string;
  dateTime: string;
  meetingLink: string;
  videoUrl?: string;
  pptUrl?: string;
  instructor: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: Training;
}

export default function CalendarPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<View>(Views.MONTH);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
      return;
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchTrainings();
    }
  }, [user]);

  const fetchTrainings = async () => {
    try {
      console.log('Fetching trainings...');
      const response = await fetch('/api/trainings');
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched trainings:', data);
        setTrainings(data);

        // Convert trainings to calendar events
        const calendarEvents: CalendarEvent[] = data.map(
          (training: Training) => ({
            id: training.id,
            title: training.title,
            start: new Date(training.dateTime),
            end: new Date(
              new Date(training.dateTime).getTime() + 60 * 60 * 1000
            ), // 1 hour duration
            resource: training,
          })
        );

        console.log('Calendar events:', calendarEvents);
        setEvents(calendarEvents);
      } else {
        console.error('Failed to fetch trainings:', response.status);
      }
    } catch (error) {
      console.error('Error fetching trainings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    console.log('Event selected:', event);
    setSelectedEvent(event);
    setShowModal(true);
  }, []);

  const handleNavigate = useCallback(
    (date: Date, view: View, action: string) => {
      console.log('Navigate:', { date, view, action });
      setCurrentDate(date);
    },
    []
  );

  const handleViewChange = useCallback((view: View) => {
    console.log('View changed:', view);
    setCurrentView(view);
  }, []);

  // Custom navigation handlers
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const goToPreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const goToPreviousYear = () => {
    setCurrentDate(subYears(currentDate, 1));
  };

  const goToNextYear = () => {
    setCurrentDate(addYears(currentDate, 1));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'FE':
        return '#3B82F6'; // blue
      case 'BE':
        return '#10B981'; // green
      case 'QA':
        return '#F59E0B'; // amber
      case 'General':
        return '#8B5CF6'; // purple
      default:
        return '#6B7280'; // gray
    }
  };

  const eventStyleGetter = useCallback((event: CalendarEvent) => {
    const backgroundColor = getCategoryColor(event.resource.category);
    return {
      style: {
        backgroundColor,
        borderRadius: '5px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
        fontSize: '12px',
        padding: '2px 5px',
      },
    };
  }, []);

  const isUpcoming = (dateTime: string) => {
    return new Date(dateTime) > new Date();
  };

  // Custom event component with hover tooltip
  const EventComponent = ({ event }: { event: CalendarEvent }) => {
    return (
      <div
        title={`${event.resource.title}\nBy: ${event.resource.conductedBy}\nTime: ${format(event.start, 'h:mm a')}`}
        className='cursor-pointer hover:opacity-100 transition-opacity'
        style={{ fontSize: '11px', lineHeight: '1.2' }}
      >
        <strong>{event.title}</strong>
        <br />
        <span style={{ fontSize: '10px' }}>
          by {event.resource.conductedBy}
        </span>
      </div>
    );
  };

  if (loading || isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-white'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  console.log(
    'Rendering calendar with events:',
    events,
    'Current date:',
    currentDate
  );

  return (
    <div className='min-h-screen relative flex flex-col items-center justify-center px-4 overflow-hidden bg-gradient-to-br from-blue-100 via-indigo-100 to-pink-100'>
      {/* Animated background shapes */}
      <div className='absolute inset-0 pointer-events-none z-0'>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 0.18, y: 0 }}
          transition={{ duration: 1.2 }}
          className='absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full blur-3xl opacity-30 animate-pulse'
        />
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 0.15, x: 0 }}
          transition={{ duration: 1.5 }}
          className='absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tr from-pink-400 to-yellow-300 rounded-full blur-3xl opacity-30 animate-pulse'
        />
        <motion.img
          src='/globe.svg'
          alt='Learning Globe'
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 1.8 }}
          className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] object-contain select-none pointer-events-none'
        />
      </div>
      <div className='max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 w-full z-10'>
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className='mb-8'>
            <h1 className='text-3xl font-bold text-gray-900 mb-2 drop-shadow-lg'>
              Training Calendar
            </h1>
            <p className='text-gray-600'>
              View all scheduled training sessions
            </p>
            <p className='text-sm text-gray-500'>
              Debug: {events.length} events loaded | Current:{' '}
              {format(currentDate, 'MMMM yyyy')}
            </p>
          </div>
        </motion.div>
        {/* Legend */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className='mb-6 bg-white/80 p-4 rounded-lg shadow backdrop-blur-md'
        >
          <h3 className='text-sm font-medium text-gray-900 mb-3'>Categories</h3>
          <div className='flex flex-wrap gap-4'>
            <div className='flex items-center'>
              <div
                className='w-4 h-4 rounded'
                style={{ backgroundColor: getCategoryColor('FE') }}
              ></div>
              <span className='ml-2 text-sm text-gray-700'>Frontend (FE)</span>
            </div>
            <div className='flex items-center'>
              <div
                className='w-4 h-4 rounded'
                style={{ backgroundColor: getCategoryColor('BE') }}
              ></div>
              <span className='ml-2 text-sm text-gray-700'>Backend (BE)</span>
            </div>
            <div className='flex items-center'>
              <div
                className='w-4 h-4 rounded'
                style={{ backgroundColor: getCategoryColor('QA') }}
              ></div>
              <span className='ml-2 text-sm text-gray-700'>
                Quality Assurance (QA)
              </span>
            </div>
            <div className='flex items-center'>
              <div
                className='w-4 h-4 rounded'
                style={{ backgroundColor: getCategoryColor('General') }}
              ></div>
              <span className='ml-2 text-sm text-gray-700'>General</span>
            </div>
          </div>
        </motion.div>
        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className='mb-6 bg-blue-50/80 border border-blue-200 rounded-lg p-4 backdrop-blur-md'
        >
          <h3 className='text-sm font-medium text-blue-900 mb-2'>
            📅 How to use the calendar:
          </h3>
          <ul className='text-sm text-blue-800 space-y-1'>
            <li>
              • Use the <strong>Today</strong>, <strong>Back</strong>, and{' '}
              <strong>Next</strong> buttons to navigate
            </li>
            <li>
              • Switch between <strong>Month</strong>, <strong>Week</strong>,
              and <strong>Day</strong> views
            </li>
            <li>
              • <strong>Hover</strong> over events to see quick details
            </li>
            <li>
              • <strong>Click</strong> on events to open detailed information
              modal
            </li>
          </ul>
        </motion.div>
        {/* Events List for Debug */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className='mb-6 bg-white/80 p-4 rounded-lg shadow backdrop-blur-md'
        >
          <h3 className='text-sm font-medium text-gray-900 mb-3'>
            Upcoming Events ({events.filter(e => e.start >= new Date()).length})
          </h3>
          {events.length === 0 ? (
            <p className='text-gray-500'>No events to display</p>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {events
                .filter(event => event.start >= new Date())
                .slice(0, 6)
                .map(event => (
                  <motion.div
                    key={event.id}
                    className='p-3 border rounded-lg cursor-pointer hover:bg-gray-100/80 transition-colors shadow-md hover:shadow-xl backdrop-blur-md'
                    whileHover={{
                      scale: 1.03,
                      boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                    }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleSelectEvent(event)}
                  >
                    <div className='flex items-start justify-between'>
                      <div className='flex-1'>
                        <h4 className='font-medium text-sm text-gray-900'>
                          {event.title}
                        </h4>
                        <p className='text-xs text-gray-600 mt-1'>
                          by {event.resource.conductedBy}
                        </p>
                        <p className='text-xs text-gray-500'>
                          {format(event.start, 'MMM dd, yyyy - h:mm a')}
                        </p>
                      </div>
                      <span
                        className='px-2 py-1 text-xs rounded text-white'
                        style={{
                          backgroundColor: getCategoryColor(
                            event.resource.category
                          ),
                        }}
                      >
                        {event.resource.category}
                      </span>
                    </div>
                  </motion.div>
                ))}
            </div>
          )}
        </motion.div>
        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9 }}
          className='bg-white/90 p-6 rounded-lg shadow-xl backdrop-blur-md'
        >
          <h3 className='text-lg font-medium text-gray-900 mb-4'>
            Training Calendar
          </h3>
          <div style={{ height: '700px' }}>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor='start'
              endAccessor='end'
              date={currentDate}
              view={currentView}
              onNavigate={handleNavigate}
              onView={handleViewChange}
              onSelectEvent={handleSelectEvent}
              eventPropGetter={eventStyleGetter}
              views={[Views.MONTH, Views.WEEK, Views.DAY]}
              popup={true}
              popupOffset={30}
              style={{ height: '100%' }}
              step={60}
              showMultiDayTimes
              components={{
                event: props => (
                  <motion.div
                    whileHover={{ scale: 1.05, opacity: 1 }}
                    whileTap={{ scale: 0.97 }}
                    className='transition-transform'
                  >
                    <EventComponent {...props} />
                  </motion.div>
                ),
                toolbar: ({ label, onNavigate, onView, view }) => (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className='calendar-toolbar mb-4'
                  >
                    <div className='flex flex-wrap items-center justify-between gap-4'>
                      {/* Navigation Controls */}
                      <div className='flex items-center gap-2'>
                        {/* Year Navigation */}
                        <motion.button
                          type='button'
                          onClick={goToPreviousYear}
                          className='px-3 py-1 bg-red-100 text-red-700 border border-red-300 rounded hover:bg-red-200 transition-colors text-sm font-medium shadow-sm'
                          title='Previous Year'
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          ‹‹ {format(subYears(currentDate, 1), 'yyyy')}
                        </motion.button>
                        <motion.button
                          type='button'
                          onClick={goToNextYear}
                          className='px-3 py-1 bg-green-100 text-green-700 border border-green-300 rounded hover:bg-green-200 transition-colors text-sm font-medium shadow-sm'
                          title='Next Year'
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {format(addYears(currentDate, 1), 'yyyy')} ››
                        </motion.button>
                        {/* Month Navigation */}
                        <motion.button
                          type='button'
                          onClick={goToPreviousMonth}
                          className='px-3 py-1 bg-orange-100 text-orange-700 border border-orange-300 rounded hover:bg-orange-200 transition-colors text-sm font-medium shadow-sm'
                          title='Previous Month'
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          ‹ {format(subMonths(currentDate, 1), 'MMM')}
                        </motion.button>
                        <motion.button
                          type='button'
                          onClick={goToNextMonth}
                          className='px-3 py-1 bg-purple-100 text-purple-700 border border-purple-300 rounded hover:bg-purple-200 transition-colors text-sm font-medium shadow-sm'
                          title='Next Month'
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {format(addMonths(currentDate, 1), 'MMM')} ›
                        </motion.button>
                        {/* Today Button */}
                        <motion.button
                          type='button'
                          onClick={goToToday}
                          className='px-3 py-1 bg-blue-600 text-white border border-blue-600 rounded hover:bg-blue-700 transition-colors text-sm font-medium shadow shadow-blue-200'
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Today
                        </motion.button>
                      </div>
                      <div className='text-xl font-semibold text-gray-900 drop-shadow-lg'>
                        {label}
                      </div>
                      {/* View Controls */}
                      <div className='flex items-center gap-1 border border-gray-300 rounded overflow-hidden shadow-sm'>
                        <motion.button
                          type='button'
                          onClick={() => onView(Views.MONTH)}
                          className={`px-3 py-1 text-sm font-medium transition-colors ${view === Views.MONTH ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Month
                        </motion.button>
                        <motion.button
                          type='button'
                          onClick={() => onView(Views.WEEK)}
                          className={`px-3 py-1 text-sm font-medium transition-colors ${view === Views.WEEK ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Week
                        </motion.button>
                        <motion.button
                          type='button'
                          onClick={() => onView(Views.DAY)}
                          className={`px-3 py-1 text-sm font-medium transition-colors ${view === Views.DAY ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Day
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ),
              }}
            />
          </div>
        </motion.div>
        {/* Event Detail Modal */}
        <AnimatePresence>
          {showModal && selectedEvent && (
            <motion.div
              className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className='relative top-20 mx-auto p-5 border w-96 shadow-2xl rounded-2xl bg-white/90 backdrop-blur-xl'
              >
                <div className='mt-3'>
                  <div className='flex items-center justify-between mb-4'>
                    <h3 className='text-lg font-medium text-gray-900'>
                      {selectedEvent.resource.title}
                    </h3>
                    <motion.button
                      onClick={() => setShowModal(false)}
                      className='text-gray-400 hover:text-gray-600'
                      whileHover={{ scale: 1.15, rotate: 90 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg
                        className='w-6 h-6'
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
                    </motion.button>
                  </div>
                  <div className='space-y-3'>
                    <div>
                      <span className='text-sm font-medium text-gray-500'>
                        Category:
                      </span>
                      <span
                        className='ml-2 px-2 py-1 text-xs rounded text-white'
                        style={{
                          backgroundColor: getCategoryColor(
                            selectedEvent.resource.category
                          ),
                        }}
                      >
                        {selectedEvent.resource.category}
                      </span>
                    </div>
                    <div>
                      <span className='text-sm font-medium text-gray-500'>
                        Conducted By:
                      </span>
                      <span className='ml-2 text-sm text-gray-900'>
                        {selectedEvent.resource.conductedBy}
                      </span>
                    </div>
                    <div>
                      <span className='text-sm font-medium text-gray-500'>
                        Date & Time:
                      </span>
                      <span className='ml-2 text-sm text-gray-900'>
                        {format(
                          new Date(selectedEvent.resource.dateTime),
                          'MMMM do yyyy, h:mm a'
                        )}
                      </span>
                    </div>
                    <div>
                      <span className='text-sm font-medium text-gray-500'>
                        Description:
                      </span>
                      <p className='mt-1 text-sm text-gray-900'>
                        {selectedEvent.resource.description}
                      </p>
                    </div>
                  </div>
                  <div className='mt-6 flex gap-3'>
                    <a
                      href={`/training/${selectedEvent.resource.id}`}
                      className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium shadow whitespace-nowrap'
                    >
                      View Training
                    </a>
                    <motion.button
                      onClick={() => setShowModal(false)}
                      className='bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded text-sm font-medium shadow'
                      whileHover={{ scale: 1.07 }}
                      whileTap={{ scale: 0.96 }}
                    >
                      Close
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
