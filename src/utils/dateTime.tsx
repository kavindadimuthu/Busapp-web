import { format } from 'date-fns';

export const formatTime = (timeString: string): string => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(Number(hours), Number(minutes));
    return format(date, 'hh:mm a');
};

export const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    return format(new Date(dateString), 'MMMM dd, yyyy');
};

export const formatDuration = (totalMinutes: number): string => {
    if (!totalMinutes) return 'N/A';
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
};