export const dockerRun = (
  cmd: string,
  volume: string,
  image: string,
  workDir = '/usr/app',
): void => {
  Bun.spawnSync([
    'docker',
    'run',
    '--rm',
    `-v ${volume}:${workDir}`,
    `-w ${workDir}`,
    image,
    cmd,
  ])
}
