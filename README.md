<!-- omit in toc -->
# Development Environment Management System (DEMS)

[![🧪 Tests](https://github.com/angelmadames/dems-cli/actions/workflows/tests.yml/badge.svg)](https://github.com/angelmadames/dems-cli/actions/workflows/tests.yml)

<!-- omit in toc -->
## Contents

- [🗒️ Overview](#️-overview)
- [🔧 Setup](#-setup)
- [🖍️ Style](#️-style)
- [🏗️ Structure](#️-structure)
  - [🟢 Commands](#-commands)
  - [🔵 Config](#-config)
  - [🟠 Utils](#-utils)

## 🗒️ Overview

DEMS is a generic CLI tool meant to assist teams to quickly get from onboarding
to coding by automating the initialization process of an application (git clone,
deps install, provisioning of required services like databases or mail servers)
using Docker.

DEMS is made with [Bun], [TypeScript] and [Commander.js].

## 🔧 Setup

To install dependencies:

```shell
bun install
```

To run:

```shell
./cli.ts --help
```

## 🖍️ Style

Our chosen format and lint tool is [Biome]. For more information about our
preset and custom rules configuration, see the [biome.json](./biome.json)
file.

## 🏗️ Structure

The current version of DEMS in this repository is a modern adaptation of an internal
tool with the same name that I made for [gbh.tech]. The original version was made
purely with Bash scripts, which is the main motivation for this newer version, to
extend its capabilities with a rich ecosystem and make it more accesible to developers.

The structure of DEMS is simple: it has **commands** ([/src/commands](./src//commands/)),
and those commands depend on **utilities** ([/src/utils](./src/utils/)) and **config
files** ([/src/config](./src/config/)).

### 🟢 Commands

As you'd expect, `commands` are the protagonists of DEMS. They assist the software engineer
in the various tasks needed to setup a local project and start working on it.

Commands are instances of the Command class provided by [Commander.js], which are then
added to the main `cli` Command object in the [./cli.ts](./cli.ts) file with `addCommand()`.

> 💡 Execute `dems --help` to check all available commands.

### 🔵 Config

The DEMS Config is split into three (3) different contexts found in two different files: [./src/config/cli.ts](./src/config//cli.ts) and [./src/config/dems.ts](./src/config//dems.ts).

- **CLI**: modifies the behavior of the CLI tool, without affecting any specific project.
- **DEMS**: defines the configuration directives of DEMS for every project, in the form of a `config.json` file.
- **Environment**: defines the blogal environment variables of DEMS that can affect all other configurations (all env vars start with a prefix `DEMS_` to avoid conflicts).

### 🟠 Utils

The Utils are simply re-usable functions that assist commands, they can go from simple things
like normalizing a string, to more complex tags like generating a .env file from the config.json
of the project or generating parameter for Docker Compose.

For more information, check the [./src/utils](./src//utils/) directory.

<!-- References -->
[Bun]: https://bun.sh
[TypeScript]: https://www.typescriptlang.org
[Commander.js]: https://github.com/tj/commander.js
[Biome]: https://biomejs.dev
[gbh.tech]: https://gbh.tech
