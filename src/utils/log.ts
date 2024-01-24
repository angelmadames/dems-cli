import chalk from 'chalk';

const log = {
  info: (...text: string[]): void => {
    console.log(chalk.blue(text));
  },

  success: (...text: string[]): void => {
    console.log(chalk.green(text));
  },

  warning: (...text: string[]): void => {
    console.log(chalk.yellow(text));
  },

  error: (...text: string[]): void => {
    console.log(chalk.red(text));
  },
};

export default log;
