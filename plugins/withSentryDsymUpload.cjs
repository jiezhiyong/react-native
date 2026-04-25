const { withXcodeProject } = require('expo/config-plugins');

const SENTRY_BUILD_PHASE_NAME = 'Upload Debug Symbols to Sentry';
const SENTRY_UPLOAD_COMMAND =
  "/bin/sh `${NODE_BINARY:-node} --print \"require('path').dirname(require.resolve('@sentry/react-native/package.json')) + '/scripts/sentry-xcode-debug-files.sh'\"`";

/**
 * 限制 Sentry dSYM 上传仅在 Release 或 CI 构建执行
 * 本地 Debug 构建跳过，避免无意义的 Sentry 上传和相关 warning。
 */
module.exports = function withSentryDsymUpload(config) {
  // Expo config mods for the same native file are composed as nested wrappers.
  // A later-registered `withXcodeProject` action enters first and then calls the
  // previously registered action through `nextMod`. Because this plugin mutates
  // the Sentry build phase before `nextMod` is called by Expo's helper, it must
  // be registered before `@sentry/react-native/expo` in app.config.ts. That makes
  // Sentry create/update the build phase first, then this plugin applies the
  // Release/CI guard as the final xcodeproj mutation.
  return withXcodeProject(config, (config) => {
    const phases = config.modResults.hash.project.objects.PBXShellScriptBuildPhase;

    for (const phase of Object.values(phases)) {
      if (!phase || phase.name !== `"${SENTRY_BUILD_PHASE_NAME}"`) {
        continue;
      }

      // Keep the build phase in the project so Release and CI builds still
      // upload dSYMs, but make local Debug builds exit before invoking Sentry.
      phase.shellScript = guardedScript;
    }

    return config;
  });
};

const guardedScript = JSON.stringify(`if [[ "$CONFIGURATION" != *Release* && -z "$CI" ]]; then
  echo "Skipping Sentry dSYM upload for $CONFIGURATION because this is not a Release or CI build."
  exit 0
fi

${SENTRY_UPLOAD_COMMAND}`);
