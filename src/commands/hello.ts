import { Command } from 'commander';

const HelloCommand = new Command();

HelloCommand.name('hello').action(() => {
  console.log('Hello there!');
});

export default HelloCommand;
