import withAppleSettings, {
  ChildPane,
  Group,
  RadioGroup,
  Slider,
  Switch,
  TextField,
  Title,
  MultiValue,
} from "@config-plugins/apple-settings";
import { UPDATES_API_KEYS } from "./src/apple-settings-x/shared";
import { ConfigContext, ExpoConfig } from "expo/config";

module.exports = ({ config }: ConfigContext): Partial<ExpoConfig> => {
  config = withAppleSettings(config as ExpoConfig, {
    // The name of the .plist file to generate. Root is the default and must be provided.
    Root: {
      // The page object is required. It will be used to generate the .plist file.
      // The contents will be converted directly to plist.
      page: {
        // The `PreferenceSpecifiers` defines the UI elements to generate.
        PreferenceSpecifiers: [
          // Child panes can be used to create nested pages.
          ChildPane({
            title: "Developer Info",
            file: "info",
          }),
          ChildPane({
            title: "Runtime",
            file: "runtime",
          }),
          Group({
            title: "About",
            footerText: "Built by Evan Bacon 🥓\nPowered by Expo 𝝠",
          }),
        ],
      },
    },
    // Build-time info
    info: {
      page: {
        PreferenceSpecifiers: [
          Title({
            title: "Bundle Identifier",
            value: config.ios?.bundleIdentifier!,
            key: "info_1_pref",
          }),
          Title({
            title: "Expo SDK",
            value: config.sdkVersion ?? "???",
            key: "info_2_pref",
          }),
          Title({
            title: "Scheme",
            value: Array.isArray(config.scheme)
              ? config.scheme.join(", ")
              : config.scheme!,
            key: "info_3_pref",
          }),
        ],
      },
    },
    runtime: {
      page: {
        PreferenceSpecifiers: [
          Group({
            // idk but this seems like a better name than "Updates" in case it shows in search.
            title: "Runtime",
            footerText: "Based on the last successful launch of the app",
          }),
          ...UPDATES_API_KEYS.map(({ setting, name }) =>
            Title({
              title: name,
              value: "[Pending]",
              key: setting,
            })
          ),
          Title({
            title: "Updated",
            key: "p_exupdates__updatedAt",
            value: "[Pending]",
          }),

          Group({
            title: "Latest",
            footerText: "Based on the running instance of the app",
          }),
          Title({
            title: "Status",
            key: "p_exupdates_live_type",
            value: "[Pending]",
          }),
          Title({
            title: "Details",
            key: "p_exupdates_live_message",
            value: "[Pending]",
          }),
          Title({
            title: "Updated",
            key: "p_exupdates_live__updatedAt",
            value: "[Pending]",
          }),
        ],
      },
    },
  });

  return config;
};