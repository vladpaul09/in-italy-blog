const slugifyService = (value: string) =>
  value
    .replace(/[^a-z0-9 ]/gi, "")
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();

export default slugifyService;