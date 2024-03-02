import chalk from 'chalk';

const log = {
  info: (text: string[], ...optionalParams: string[]) => {
    return console.log(chalk.blue(text), optionalParams);
  },

  success: (text: string[], ...optionalParams: string[]) => {
    return console.log(chalk.green(text), optionalParams);
  },

  warning: (text: string[], ...optionalParams: string[]) => {
    return console.log(chalk.yellow(text), optionalParams);
  },

  dimmedWarning: (text: string[], ...optionalParams: string[]) => {
    return console.log(chalk.dim.yellow(text), optionalParams);
  },

  error: (text: string[], ...optionalParams: string[]) => {
    return console.log(chalk.red(text), optionalParams);
  },
};

export default log;
