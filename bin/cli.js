#!/usr/bin/env NODE_NO_WARNINGS=1 node

import { program } from 'commander';
import { execa } from 'execa';
import inquirer from 'inquirer';
import Listr from 'listr';
import _ from 'lodash';
import templateFile from 'template-file';
import packageJson from '../package.json' assert { type: 'json' };
const { renderToFolder } = templateFile;
const { snakeCase } = _;

const defineOptions = () => {
  program.option('-n, --name [string]', 'the name of your project');
  program.option('-s, --schema [string]', 'the PostgreSQL schema to use');
  program.version(`v${packageJson.version}`);
  program.showHelpAfterError();
  program.parse();
  return program.opts();
};

const prompt = options =>
  inquirer.prompt([
    {
      type: 'input',
      message: 'Enter the name of your project:',
      name: 'name',
      default: 'my-project',
      when: () => !options.name,
    },
    {
      type: 'input',
      message: 'Enter the PostgreSQL schema to use:',
      name: 'schema',
      default: 'public',
      when: () => !options.schema,
    },
  ]);

let options = defineOptions();

prompt(options).then(answers => {
  options = { ...options, ...answers };
  options.dbName = snakeCase(options.name);

  const tasks = new Listr([
    {
      title: `Clone project to ${options.name}`,
      task: () => {
        const { name: cwd } = options;

        return execa('git', [
          'clone',
          '--depth=1',
          `https://github.com/johnschult/${packageJson.name}.git`,
          cwd,
        ]).then(() =>
          execa('git', ['filter-branch', '--subdirectory-filter', 'template'], {
            cwd,
          })
        );
      },
    },
    {
      title: 'Configure your project',
      task: () => {
        const { name: cwd } = options;
        execa('mv', ['gitignore', '.gitignore'], { cwd });
        renderToFolder(`${cwd}/*.json`, cwd, options);
        renderToFolder(`${cwd}/*.md`, cwd, options);
        renderToFolder(`${cwd}/sql/*.sql`, `${cwd}/sql/`, options);
        renderToFolder(`${cwd}/config/**/*.js`, `${cwd}/config/`, options);
      },
    },
    {
      title: 'Install package dependencies with Yarn',
      task: () => {
        const { name: cwd } = options;

        return execa('yarn', {
          cwd,
          stdout: 'pipe',
        });
      },
    },
    {
      title: 'Initialize git',
      task: () => {
        const { name: cwd } = options;

        return execa('rm', ['-rf', '.git'], { cwd }).then(() =>
          execa('git', ['init'], { cwd })
        );
      },
    },
  ]);

  tasks.run().catch(err => {
    console.error(err);
  });
});
