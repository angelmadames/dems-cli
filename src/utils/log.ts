import chalk from 'chalk';

const log = {
  info: (text?: any, ...optionalParams: any[]) => {
    return console.log(chalk.blue(text), ...optionalParams);
  },

  success: (text?: any, ...optionalParams: any[]) => {
    return console.log(chalk.green(text), ...optionalParams);
  },

  warning: (text?: any, ...optionalParams: any[]) => {
    return console.log(chalk.yellow(text), ...optionalParams);
  },

  dimmedWarning: (text?: any, ...optionalParams: any[]) => {
    return console.log(chalk.dim.yellow(text), ...optionalParams);
  },

  error: (text?: any, ...optionalParams: any[]) => {
    return console.log(chalk.red(text), ...optionalParams);
  },
};

export default log;
