export const convertDateToCalendarFormat = (date) => {
    const [day, month, year] = date.split(/[\.,\s:]/);
    return `${year}-${month}-${day}`;
};

export const convertCalendarToDateFormat = (date) => {
    const [year, month, day] = date.split('-');
    return `${day}.${month}.${year}`;
};

export const extractTime = (dateString) => {
    const timeMatch = dateString.match(/\b\d{2}:\d{2}\b/);
    return timeMatch ? timeMatch[0] : null;
};

export const formatDateTime = (dateTime) => {
    const [datePart, timePart] = dateTime.split(' ');
    const [hours, minutes] = timePart.split(':');
    return `${datePart} ${hours}:${minutes}`;
};