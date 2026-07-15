export default function formatDate(dateValue, options = {}) {
    if (!dateValue) {
        return 'Unknown date';
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return 'Unknown date';
    }

    const {
        dateStyle = 'medium',
        timeStyle = 'short',
    } = options;

    return new Intl.DateTimeFormat('en', {
        dateStyle,
        timeStyle,
    }).format(date);
}