# Task Manager

## About

The Task Manager is a robust and user-friendly application designed to streamline task management. Built with [Vue 3](https://vuejs.org/guide/introduction.html) and powered by [Pinia](https://pinia.vuejs.org/introduction.html) for state management and [Storybook](https://storybook.js.org/docs) for component documentation and testing. It allows users to add, edit, delete, and track tasks with ease. The project emphasizes responsive design, accessibility, and high performance, making it suitable for a wide range of users.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Project Commands](#project-commands)
  - [serve](#serve)
  - [build](#build)
  - [lint](#lint)
  - [storybook](#storybook)
  - [build-storybook](#build-storybook)
  - [test](#test)
  - [test:coverage](#testcoverage)
  - [test:watch](#testwatch)
- [Dependencies](#dependencies)
- [Dev Dependencies](#dev-dependencies)

## Features
The Task Manager project offers the following key features:

### Core Features:
  1. **Add Tasks**: Quickly add new tasks with details like title, description, and due date, with a default status of pending
  2. **Edit Tasks**: Update task information as needed.
  3. **Delete Tasks**: Remove tasks that are no longer necessary.
  4. **Mark as In Progress**: Track tasks by marking them as in progress.
  5. **Mark as Completed**: Track progress by marking tasks as completed.
  6. **Filter by Status**: Filter tasks based on their status — Pending, In Progress, or Completed.
  7. **Sort by Due Date**: Sort tasks by their due date to prioritize work effectively
  8. **Search by Title or Description**: Find tasks quickly by searching for specific words or phrases in the title or description.

### Additional Features:
  1. **State Management**: Efficient state management with Pinia, leveraging localStorage for persistence.
  2. **Component Documentation**: Comprehensive documentation of components using Storybook.
  3. **Unit Testing**: Extensive unit testing with Vitest, achieving over 95% test coverage.
  4. **Responsive Design**: Optimized for usability across a variety of devices and screen sizes.
  5. **Accessibility**: Designed to be accessible to all users.
  6. **LightStep Score of 99**: Reflects exceptional performance and reliability in production environments.

## Getting Started

To get started with this project, ensure you have Node.js and npm (or Yarn) installed on your machine. Clone the repository and install the dependencies:

```bash
npm install
```

or if you use Yarn:

```bash
yarn install
```

## Project Commands

### serve

```bash
npm run serve
```

**Description**: This command starts the local development server using Vue CLI. The server will watch for any changes in your files and automatically reload the page when changes are detected. By default, the development server runs at `http://localhost:8080`.

**Use Case**: Use this command when you are actively developing your application. It provides a fast feedback loop, allowing you to see your changes in real-time.

### build

```bash
npm run build
```

**Description**: This command compiles your Vue application for production. It bundles the files, optimizes the assets, and outputs the build to the `dist` directory.

**Use Case**: Use this command when you are ready to deploy your application to a production environment. The output files are optimized for performance.

### lint

```bash
npm run lint
```

**Description**: This command runs ESLint on your codebase to analyze your JavaScript/TypeScript and Vue files for potential errors and code style issues. The linting rules are defined in the `.eslintrc` configuration file.

**Use Case**: Use this command before committing your code to ensure it meets the project's coding standards and to catch any potential bugs early.

### storybook

```bash
npm run storybook
```

**Description**: This command starts the Storybook development server, allowing you to view and interact with your Vue components in isolation. Storybook runs on `http://localhost:6006` by default.

**Use Case**: Use this command when you want to develop or document individual components without running the entire application. Storybook provides a powerful environment for creating and testing UI components.

### build-storybook

```bash
npm run build-storybook
```

**Description**: This command builds a static version of your Storybook documentation. The output is saved in the `storybook-static` directory, which you can deploy to any static hosting service.

**Use Case**: Use this command when you want to generate a production-ready version of your Storybook documentation. This is useful for sharing your component library with others or hosting it online.

### test

```bash
npm run test
```

**Description**: This command runs all unit tests in your project using Vitest. It performs a single test run and outputs the results to the console.

**Use Case**: Use this command to execute your test suite and ensure that your code is functioning as expected. It is typically run during continuous integration (CI) processes.

### test:coverage

```bash
npm run test:coverage
```

**Description**: This command runs your test suite with Vitest and generates a code coverage report. The coverage report shows how much of your code is covered by tests and is saved in the `coverage` directory.

**Use Case**: Use this command to assess the effectiveness of your tests. High coverage indicates that most of your code is being tested, while low coverage may suggest that some areas need more testing.

### test:watch

```bash
npm run test:watch
```

**Description**: This command runs Vitest in watch mode, which means that it will continuously watch your files for changes and re-run the tests whenever you modify your code.

**Use Case**: Use this command during development to get immediate feedback on your tests as you write or modify code. It helps you catch issues early in the development process.

## Dependencies

Here’s a brief overview of the key dependencies used in this project:

- **vue**: The progressive JavaScript framework used to build the user interface.
- **pinia**: The store library for Vue that provides reactive state management.
- **pinia-plugin-persistedstate**: A plugin for Pinia that persists the state across page reloads.
- **core-js**: Provides polyfills for JavaScript features to ensure compatibility with older browsers.

## Dev Dependencies

These tools help with development but are not included in the final production build:

- **@vue/cli-service**: The Vue CLI service used to build and serve your application.
- **storybook**: A tool for developing UI components in isolation.
- **vitest**: A blazing-fast unit testing framework that works well with Vue.
- **@vue/test-utils**: Provides utilities for testing Vue components.
- **sass**: A preprocessor that compiles SCSS to CSS.
- **typescript**: Adds static typing to JavaScript for improved developer experience and error checking.

## Conclusion

This README provides an overview of how to work with the Task Manager project, including explanations of the available npm scripts and their use cases. For further information or detailed usage, please refer to the official documentation of the respective tools and libraries.
