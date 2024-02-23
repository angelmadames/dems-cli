import { projectConfig } from '../config/project';

export const dockerRun = (
  cmd: string,
  volume: string,
  image: string,
  workDir = '/usr/app',
): void => {
  const config = projectConfig();
  const result = Bun.spawnSync([
    'docker',
    'run',
    '--rm',
    `-v ${volume}:${workDir}`,
    `-w ${workDir}`,
    image,
    cmd,
  ]);
};
