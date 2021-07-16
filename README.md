지극히 개인적으로 사용하기 위해 만든 CLI by nodejs

# Installation

npm에 등록하지 않아서 패키지를 받아서 직접 설치한다.

```bash
npm run install
npm run build
npm install -g
```

# Usage

최상위 커맨드 `nu`를 상용하거나 개별 등록된 커맨드를 직접 사용한다.

```bash
# show command list
> nu
Usage: nu [options] [command]

Options:
  -V, --version                output the version number
  -h, --help                   display help for command

Commands:
  checkout [options] [branch]  switch git branch
  help [command]               display help for command

# run command (see "bin" in package.json)
> nu checkout
> which branch do you want to checkout?
  1) * master
  2) develop
  Answer:
# or
> checkout
> which branch do you want to checkout?
  1) * master
  2) develop
  Answer:
```

# Add Command

[commander](https://github.com/tj/commander.js)를 사용해서 `src/command` 아래에 커맨드의 정의(`checkout/command.ts`)와 실행코드(`checkout/index.ts`)를 분리해서 작성 한 후(분리하지 않으면 상위 커맨드 `nu` 실행시 해당 커맨드가 실행된다.) `src/commands`의 export에 추가한다.  
커맨드를 개별로 실행하려면 `package.json`의 `bin` 항목에 `"[실행할 커맨드]": "./dist/src/command/[커맨드 실행파일 경로]`를 추가한다.
