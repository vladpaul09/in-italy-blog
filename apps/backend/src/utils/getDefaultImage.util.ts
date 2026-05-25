import config from "../config/app.config";
import { Settings } from "../app/models";

// Map entity type to settings key and default folder
const defaultImageConfig: Record<string, { settingsKey: string; folder: string }> = {
  default: { settingsKey: "defaultImage", folder: "defaults" },
  // event: { settingsKey: "defaultEventImage", folder: "events" },
};

/**
 * Returns the default image URL for a given type, checking settings first, then falling back to the static default.
 * @param type Entity type (article, event, podcast, etc.)
 */
export default async function getDefaultImageUrl(type: string): Promise<string> {
  const configEntry = defaultImageConfig[type];
  if (configEntry) {
    // Try to get from settings
    const setting = await Settings.findOne({ where: { id: configEntry.settingsKey } });
    if (setting && setting.value) {
      // Assume value is just the filename
      return `${config.serverNameStatics}/uploads/images/${configEntry.folder}/${setting.value}`;
    }
  }
  // Fallback to static default
  return "/statics/images/defaults/default_1.jpg";
}
