// £8.95 is stored as 895 pence to avoid float drift. Format at the edge only.
export const formatPrice = (pence: number): string => '£' + (pence / 100).toFixed(2);
