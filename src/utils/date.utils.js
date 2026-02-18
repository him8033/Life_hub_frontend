export const formatDateTime = (dateString, locale = 'en-US') => {
    if (!dateString) return '—';

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) return '—';

    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short' }); // Jan, Feb
    const year = date.getFullYear();

    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const period = hours >= 12 ? 'PM' : 'AM';
    const hour12 = String(hours % 12 || 12).padStart(2, '0');

    return `${day} ${month} ${year}, ${hour12}:${minutes}:${seconds} ${period}`;
};

export const formatTime = (timeString, locale = 'en-US') => {
    if (!timeString) return '—';

    // Handle both full datetime and time-only strings
    const date = new Date(
        timeString.includes('T')
            ? timeString
            : `1970-01-01T${timeString}`
    );

    if (Number.isNaN(date.getTime())) return '—';

    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const period = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;

    return `${hour12}:${minutes} ${period}`;
};
