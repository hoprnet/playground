/**
 * True if instance is running on server
 */
export const isSSR: boolean = typeof window === "undefined";

/**
 * Inspects the url to find valid options.
 * @returns options found in url query
 */
export const getUrlParams = (
  loc: Location
): Partial<{ api: string | undefined }> => {
  const params = new URLSearchParams(loc.search);
  return {
    api: params.get("api") || undefined,
  };
};

/**
 * Convert seconds to time format like mm:ss
 * @param s seconds
 * @returns a string like mm:ss
 */
export const secondsToTime = (s: number): string => {
  if (!s) return "00:00";
  const mins = String(Math.floor((s / 60) % 60)).padStart(2, "0");
  const secs = String(Math.floor(s % 60)).padStart(2, "0");
  return `${mins}:${secs}`;
};
