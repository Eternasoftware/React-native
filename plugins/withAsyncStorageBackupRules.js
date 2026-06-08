const { withDangerousMod } = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

const withAsyncStorageBackupRules = (config) => {
  return withDangerousMod(config, [
    "android",
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const androidProjectPath = path.join(projectRoot, "android");
      const resPath = path.join(androidProjectPath, "app", "src", "main", "res", "xml");

      if (!fs.existsSync(resPath)) {
        fs.mkdirSync(resPath, { recursive: true });
      }

      const dataExtractionRules = `<?xml version="1.0" encoding="utf-8"?>
<data-extraction-rules>
    <cloud-backup>
        <include domain="sharedpref" path="."/>
        <exclude domain="sharedpref" path="device.xml"/>
    </cloud-backup>
    <device-transfer>
        <include domain="sharedpref" path="."/>
        <exclude domain="sharedpref" path="device.xml"/>
    </device-transfer>
</data-extraction-rules>`;

      const backupRules = `<?xml version="1.0" encoding="utf-8"?>
<full-backup-content>
    <include domain="sharedpref" path="."/>
    <exclude domain="sharedpref" path="device.xml"/>
</full-backup-content>`;

      fs.writeFileSync(
        path.join(resPath, "secure_store_data_extraction_rules.xml"),
        dataExtractionRules
      );
      fs.writeFileSync(path.join(resPath, "secure_store_backup_rules.xml"), backupRules);

      return config;
    },
  ]);
};

module.exports = withAsyncStorageBackupRules;
