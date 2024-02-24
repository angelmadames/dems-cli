import { describe, expect, test } from 'bun:test';
import { projectConfig } from '../../src/config/project';
import { composeExecParams, composeFiles } from '../../src/utils/compose';

describe("Command: 'compose'", () => {
  const config = projectConfig();

  test('Returns compose exec params', () => {
    const composeSettingsString = composeExecParams();
    expect(composeSettingsString).toContain(
      `--env-file ${config.paths.env_file}`,
    );
    expect(composeSettingsString).toContain(
      `--project-name ${config.compose.project_name}`,
    );
  });

  test.skip('Returns compose files params', () => {
    const files = composeFiles({});
    expect(files).toBeArray();
    expect(files.join(' ').split(' ')).toContain('--file');
  });

  test.skip('Returns error when no arguments', () => {
    const command = Bun.spawnSync(['./cli.ts', 'compose']);
    expect(command.stdout.toString()).toContain(
      'A Compose command needs to be specified.',
    );
    expect(command.exitCode).toEqual(1);
  });

  test.skip('Returns both files and exec params', () => {
    const command = Bun.spawnSync(['./cli.ts', 'compose', 'show-args']);
    expect(command.stdout.toString()).toContain('Compose command params:');
    expect(command.stdout.toString()).toContain('Compose files params:');
    expect(command.exitCode).toEqual(0);
  });
});
