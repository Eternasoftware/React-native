const { withPodfile } = require("expo/config-plugins");

module.exports = function withRnfbNonModularFix(config, props = {}) {
  const opts = {
    allTargets: props.allTargets !== false,
    disableDefinesModuleForRNFB: !!props.disableDefinesModuleForRNFB,
  };

  return withPodfile(config, (cfg) => {
    let podfile = cfg.modResults.contents;

    if (podfile.includes("CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES")) {
      return cfg;
    }

    const projectBlock = `installer.pods_project.build_configurations.each do |config|
  config.build_settings['CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES'] = 'YES'
end`;

    const targetsBlock = `installer.pods_project.targets.each do |target|
  ${opts.allTargets ? "" : "next unless target.name.start_with?('RNFB')"}
  target.build_configurations.each do |config|
    config.build_settings['CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES'] = 'YES'
  end
  ${
    opts.disableDefinesModuleForRNFB
      ? "if target.name.start_with?('RNFB')\n  target.build_configurations.each do |config|\n    config.build_settings['DEFINES_MODULE'] = 'NO'\n  end\nend"
      : ""
  }
end`;

    const hasPostInstall = /post_install do \|installer\|([\s\S]*?)end\s*$/m.test(podfile);

    if (!hasPostInstall) {
      podfile += `

post_install do |installer|
  ${projectBlock}

  ${targetsBlock}
end
`;
    } else {
      podfile = podfile.replace(
        /post_install do \|installer\|([\s\S]*?)end\s*$/m,
        (match, body) => {
          let newBody = body;
          if (!newBody.includes(projectBlock)) {
            newBody = `${newBody.trimEnd()}

  ${projectBlock}
`;
          }
          if (!newBody.includes("installer.pods_project.targets.each do |target|")) {
            newBody = `${newBody.trimEnd()}

  ${targetsBlock}
`;
          }
          return `post_install do |installer|${newBody}end`;
        }
      );
    }

    cfg.modResults.contents = podfile;
    return cfg;
  });
};
