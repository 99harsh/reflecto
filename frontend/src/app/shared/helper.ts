import { format, differenceInMinutes, differenceInHours } from 'date-fns';
export function getRelativeTime(dateString: string | Date): string {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    const now = new Date();

    const mins = differenceInMinutes(now, date);
    const hours = differenceInHours(now, date);

    if (mins < 1) {
        return 'Just now';
    } else if (mins < 60) {
        return `${mins} min${mins === 1 ? '' : 's'} ago`;
    } else if (hours < 2) {
        return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    } else {
        return format(date, 'MMM dd, hh:mm a'); // Ex: Jul 31, 04:32 PM
    }
}