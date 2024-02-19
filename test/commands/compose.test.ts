import { describe, expect, test } from 'bun:test';
import { projectConfig } from '../../src/config/project';
import { composeFiles, composeSettings } from '../../src/utils/compose';

describe("Command: 'compose'", () => {
  const config = projectConfig();

  test('Returns compose files string', () => {
    const composeFileString = composeFiles({
      prefix: 'compose',
      filesDir: '.dems',
    });
    const composeSettingsString = composeSettings();

    expect(composeFileString).toBeString();
    expect(composeSettingsString).toContain(
      `--env-file ${projectConfig().paths.env_file}`,
    );
    expect(composeSettingsString).toContain(
      `-p ${projectConfig().compose.project_name}`,
    );
  });
});
