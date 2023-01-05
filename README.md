# node_cli

## Installation

```bash
pnpm install
pnpm build
npm install -g
```

## Usage

```bash
# show command list
> c
Usage: c [options] [command]

Options:
  -V, --version                output the version number
  -h, --help                   display help for command

Commands:
  checkout [options] [branch]  switch git branch
  streami                      commands for streami
  help [command]               display help for command

# run command (see "bin" in package.json)
❯ c checkout
> which branch do you want to checkout?
  1) dev/webpack
  2) * master
  Answer:
# or
❯ checkout
> which branch do you want to checkout?
  1) dev/webpack
  2) * master
  Answer:
```

## Add Command

- Define command in `src/commands` using [commander.js](https://github.com/tj/commander.js)
- Create `src/commands/[command]/index.ts` and add command `bin` in `package.json` to run command independently.
