# Description of implementation

Mockup backend works directly with two files:

`mock-backend.interceptor.ts` and `store.service.ts`

The cache service using Map to store, edit and remove data and injected only in the interceptor. This made for backend logic isolation.

### Main features:

- Standalone Components structure.
- Add random (in range, see func: `generateRandDebounceTime`) debounce time for mocked requests in Interceptor.
- Dockerized for easy deployment and production with Nginx.
- All the core logic moved in separate folder (includes: interfaces, utils, validators, services).
- Moved `shared` components and directives in separate folder.
- Considered component memory leaks prevention.
- Loaders and after action messages.
- 404 page.

# UserTestCrud

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.5.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
