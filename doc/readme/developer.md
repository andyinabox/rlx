## Developer

Developed against `couchdb@1.6.0`, behaviour in earlier versions is undefined.

### Test

Tests require a clean [couchdb][] installation running in *admin party* mode.

```
npm test
```

If an rc file is present (`~/.rlx/.rlxrc`) the tests may fail as the default configuration is required you should ensure this file does not exist before running tests.

Quick test executes commands in series but bypasses code coverage and test assertions:

```
npm run qt
```

#### Environment

* `rlx_test_server` - Specify the server to run tests against, default is `http://localhost:5984`.

### Coverage

To run test specs and generate code coverage:

```
npm run cover
```

### Documentation

To generate all documentation (manual, readme, cheatsheet etc):

```
npm run docs
```

### Manual

To generate man pages run (requires [manpage][]):

```
npm run manual
```

Generated man pages are in the [man][man] directory, to dynamically generate man pages set `NODE_ENV` to `devel` and execute the help command:

```
NODE_ENV=devel ./bin/rlx help db
```

### Lint

Run the source tree through [jshint][] and [jscs][]:

```
npm run lint
```

### Readme

To build the readme file from the partial definitions (requires [mdp][]):

```
npm run readme
```

### Cheatsheet

To generate the cheatsheet (requires [mdp][]):

```
npm run cheatsheet
```
