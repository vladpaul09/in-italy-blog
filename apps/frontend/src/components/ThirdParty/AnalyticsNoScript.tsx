import config from "@/config";

export default function AnalyticsNoScript() {
  if (process.env.NODE_ENV !== "production") {
    return null;
  }

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${config.GA_TRACKING_ID}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
      />
    </noscript>
  );
}
