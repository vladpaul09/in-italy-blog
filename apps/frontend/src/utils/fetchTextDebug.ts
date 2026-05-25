import dateTimeDebug from "./dateTimeDebug";

const fetchTextDebug = (apiUrl: string, status: number, statusText: string) => {
  return `${dateTimeDebug()}: Failed to fetch data ${apiUrl}, status ${status}: ${statusText}`;
};

export default fetchTextDebug;
