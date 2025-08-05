// Global Training interface for consistency across the app
export interface Training {
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
  instructorId?: string;
  createdAt: string;
  // Legacy support
  date?: string;
}

declare module '@/components/ProgressBar' {
  interface ProgressBarProps {
    progress: number;
    label?: string;
  }
  export function ProgressBar(props: ProgressBarProps): JSX.Element;
}

declare module '@/components/TrainingCard' {
  import { Training } from '@/types';
  interface TrainingCardProps {
    training: Training;
    categoryColor?: string;
  }
  export function TrainingCard(props: TrainingCardProps): JSX.Element;
}

declare module '@/components/calendar' {
  export function TrainingCalendar(): JSX.Element;
} 