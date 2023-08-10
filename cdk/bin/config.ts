export const Config = {
  appName: 'cloud-monitor',
  prefix: 'cloud-monitor-webui',
};

export function resolveConstructId(name: string) {
  return `${Config.prefix}-${name}`
};



