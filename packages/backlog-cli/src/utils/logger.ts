import pc from 'picocolors';

export const logger = {
  info(msg: string) {
    console.log(pc.cyan(msg));
  },
  success(msg: string) {
    console.log(pc.green(msg));
  },
  warn(msg: string) {
    console.log(pc.yellow(msg));
  },
  error(msg: string) {
    console.error(pc.red(msg));
  },
  step(label: string, count?: number | string) {
    const detail = count !== undefined ? pc.gray(` (${count})`) : '';
    console.log(`${pc.gray('↓')} ${label}${detail}`);
  },
};
