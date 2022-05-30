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
 * Convert seconds to time format like hh:ss
 * @param secs
 * @returns a string like hh:ss
 */
export const secondsToTime = (secs: number): string => {
  if (!secs) return "00:00";
  const hours = Math.floor(secs / 3600);
  const mins = Math.floor((secs - hours * 3600) / 60);
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
};
