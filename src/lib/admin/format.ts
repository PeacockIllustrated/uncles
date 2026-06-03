const ACTION_LABELS: Record<string, string> = {
  update_price: 'Price updated',
  show_item: 'Item shown',
  hide_item: 'Item hidden',
  show_section: 'Section shown',
  hide_section: 'Section hidden',
  edit_item: 'Item edited',
  add_item: 'Item added',
  delete_item: 'Item removed',
  create_news: 'News post created',
  edit_news: 'News post edited',
  publish_news: 'News published',
  unpublish_news: 'News hidden',
  delete_news: 'News post removed',
  update_settings: 'Settings updated',
};

export function describeAudit(action: string): string {
  return ACTION_LABELS[action] ?? action.replace(/_/g, ' ');
}

export function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  const seconds = Math.max(0, Math.floor((Date.now() - then) / 1000));
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months === 1 ? '' : 's'} ago`;
}
