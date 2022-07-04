# Summary of Course JavaScript Unit Testing - The Practical Guide

> <https://www.udemy.com/course/javascript-unit-testing-the-practical-guide/learn/lecture/31877676?start=0#overview>

- for basic information about `Testing` and `Testing in React` look at <https://github.com/MatchuPitchu/react-course-summary>

## Setup & Testing Environment

### Tools for Automated Tests

- `Test Runner`: e.g. `Jest`, `Vitest`, `Karma`

  - executes tests (i.e. testing code)
  - automatically detects testing code in specifically named files
  - displays results

- `Assertion Library`: e.g. `Jest`, `Vitest`, `Chai`
  - used to define expected outcomes
  - checks whether expectations are met
  - supports all kinds of expectations and modes (`sync` / `async`)

### Jest & Vitest

- `Jest` is cumbersome to configure for `ESModules`,
- `Vitest` offers integration of an API compatible with `Jest` and is faster
- `npm i --save-dev vitest`: install it into node project
- add script into `package.json`: `--globals` allows to use `it`, `expect` etc. without importing them

  ```JSON
  "scripts" : {
    "test" : "vitest --globals"
  }
  ```
