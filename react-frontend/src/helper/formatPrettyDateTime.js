export const formatSmartDateTime = (date) => {
  if (date == null || date === '') return null;
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return null;
  const now = new Date();

  const isToday = d.toDateString() === now.toDateString();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = d.toDateString() === yesterday.toDateString();

  const time = d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  if (isToday) return `Today · ${time}`;
  if (isYesterday) return `Yesterday · ${time}`;

  const datePart = d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return `${datePart} · ${time}`;
};


export const formatRelativeTime = (date) => {
  const diffMs = Date.now() - new Date(date);
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
  if (diffHr < 24) return `${diffHr} hour${diffHr > 1 ? 's' : ''} ago`;
  if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;

  return null; // 👈 important
};