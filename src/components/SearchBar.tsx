'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';

interface Training {
  id: string;
  title: string;
  description: string;
  category: string;
  conductedBy: string;
  dateTime: string;
}

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Training[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [allTrainings, setAllTrainings] = useState<Training[]>([]);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  // Fetch all trainings on component mount
  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const response = await fetch('/api/trainings');
        if (response.ok) {
          const data = await response.json();
          setAllTrainings(data);
        }
      } catch (error) {
        console.error('Error fetching trainings:', error);
      }
    };

    fetchTrainings();
  }, []);

  // Handle search
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setIsLoading(true);

    // Simple client-side search
    const searchResults = allTrainings.filter(
      training =>
        training.title.toLowerCase().includes(query.toLowerCase()) ||
        training.description.toLowerCase().includes(query.toLowerCase()) ||
        training.conductedBy.toLowerCase().includes(query.toLowerCase()) ||
        training.category.toLowerCase().includes(query.toLowerCase())
    );

    setResults(searchResults);
    setShowResults(true);
    setIsLoading(false);
  }, [query, allTrainings]);

  // Handle click outside to close results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTrainingClick = (trainingId: string) => {
    router.push(`/training/${trainingId}`);
    setShowResults(false);
    setQuery('');
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'FE':
        return 'bg-blue-100 text-blue-800';
      case 'BE':
        return 'bg-green-100 text-green-800';
      case 'QA':
        return 'bg-purple-100 text-purple-800';
      case 'General':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div ref={searchRef} className='relative w-full'>
      <form className='w-full' onSubmit={e => e.preventDefault()}>
        <div className='relative'>
          <input
            type='text'
            placeholder='Search trainings...'
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => query.length >= 2 && setShowResults(true)}
            className='w-full pl-4 pr-20 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400'
          />
          <Search className='absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none' />
          {query && (
            <button
              type='button'
              onClick={clearSearch}
              className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
            >
              <X className='w-4 h-4' />
            </button>
          )}
        </div>
      </form>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className='absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto'>
          {isLoading ? (
            <div className='p-4 text-center text-gray-500'>
              <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto'></div>
              <span className='mt-2 block'>Searching...</span>
            </div>
          ) : results.length > 0 ? (
            <div className='py-2'>
              <div className='px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b'>
                {results.length} training{results.length === 1 ? '' : 's'} found
              </div>
              {results.map(training => (
                <button
                  key={training.id}
                  onClick={() => handleTrainingClick(training.id)}
                  className='w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors'
                >
                  <div className='flex items-start justify-between'>
                    <div className='flex-1 min-w-0'>
                      <h4 className='text-sm font-medium text-gray-900 truncate'>
                        {training.title}
                      </h4>
                      <p className='text-xs text-gray-500 mt-1 line-clamp-2'>
                        {training.description}
                      </p>
                      <div className='flex items-center mt-2 text-xs text-gray-400'>
                        <span>by {training.conductedBy}</span>
                        <span className='mx-2'>•</span>
                        <span>{formatDate(training.dateTime)}</span>
                      </div>
                    </div>
                    <span
                      className={`ml-2 px-2 py-1 text-xs font-medium rounded-full flex-shrink-0 ${getCategoryColor(training.category)}`}
                    >
                      {training.category}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : query.length >= 2 ? (
            <div className='p-4 text-center text-gray-500'>
              <div className='text-gray-400 mb-2'>
                <Search className='w-8 h-8 mx-auto' />
              </div>
              <p className='text-sm'>
                No trainings found for &quot;{query}&quot;
              </p>
              <p className='text-xs text-gray-400 mt-1'>
                Try different keywords or check spelling
              </p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
