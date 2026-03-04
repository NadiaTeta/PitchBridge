export const handleApiError = (error: any): string => {
  const msg =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.error ||
    error?.message;
  return msg && typeof msg === 'string' ? msg : 'An unexpected error occurred';
};