import { ConfigPlugin } from "expo/config-plugins";
 const withPickerFix: ConfigPlugin = config => {
  return {
    ...config,
    android: {
      ...config.android,
      extraGradleProperties: {
        REACT_NATIVE_NODE_MODULES_DIR: "../node_modules"
      }
    }
  };
};

export default withPickerFix;