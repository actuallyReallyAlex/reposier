# reposier

> Tasty CLI on the outside, simple integration with GitHub's API on the inside.

[![NPM Version][npm-image]][npm-url]
[![NPM Total Downloads][npm-downloads]][npm-url]

Reposier aims to make your life easier by providing a clean CLI approach to interacting with GitHub in a variety of ways.

## Installation

### Prerequisites

1. _NodeJS_ must be installed on your machine. | [Download NodeJS](https://nodejs.org/en/)
2. _NPM_ must be installed on your machine. If you installed NodeJS correctly, NPM will be installed automatically. | [Installing NPM](https://www.npmjs.com/get-npm)


### Install from NPM

```sh
npm install -g reposier
```

## Usage Examples

### Initial Setup

```sh
reposier
```

Follow the prompts to set up your user credentials.

### Startup

```sh
reposier
```

### Generating List of Starred Repositories

Reposier can generate a markdown file to display information about the repositories you have currently starred.
Currently, markdown is the only supported filetype. In a future update, I plan to implement HTML and other file types as well.
The maximum amount of starred repositories reposier can generate a list for is 100. If you would like support for more than 100 repos, open an issue. I will implement the change if necessary.

```sh
reposier
❯ Generate List of Starred Repositories
```

![Generate List of Starred Repositories](https://res.cloudinary.com/alexlee-dev/image/upload/v1535576160/reposier/listOfStarredRepos.svg)

[Example Markdown file](https://github.com/alexlee-dev/reposier/blob/master/examples/exports/md/starredRepos.md)

### Editing Credentials

```sh
reposier
❯ Settings
❯ Edit User Credentials
```

Follow the prompts to enter your username and password.

### Viewing Credentials

```sh
reposier
❯ View User Accounts
```

### Exiting Program

```sh
reposier
❯ Exit
❯ Yes
```

## Uninstall

```sh
npm unlink
npm uninstall -g reposier
```

<!-- _For more examples and usage, please refer to the [Wiki][wiki]._ -->

<!-- ## Development setup

Describe how to install all development dependencies and how to run an automated test-suite of some kind. Potentially do this for multiple platforms.

```sh
make install
npm test
``` -->

## Release History

- 0.0.1 - Current
  - Work in progress

## Meta

Alex Lee – [@alexlee_dev](https://twitter.com/alexlee_dev) – alex@alex-lee.site

Distributed under the GPL license. See `LICENSE` for more information.

[https://github.com/alexlee-dev/](https://github.com/alexlee-dev/)

## Contributing

1. Fork it (<https://github.com/alexlee-dev/reposier/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request

## Related Projects

You might also be interested in these projects:

- [starred](https://github.com/maguowei/starred): Creating your own Awesome List by GitHub stars! | [homepage](https://github.com/maguowei/starred 'Creating your own Awesome List by GitHub stars!')
- [star-history](https://github.com/timqian/star-history): The missing star history graph of github repos. | [homepage](https://github.com/timqian/star-history 'The missing star history graph of github repos.')
- [github-stars-tagger](https://github.com/artisologic/github-stars-tagger): A Google Chrome extension that lets you add tags to your starred repositories directly on GitHub. | [homepage](https://chrome.google.com/webstore/detail/github-stars-tagger/aaihhjepepgajmehjdmfkofegfddcabc 'A Google Chrome extension that lets you add tags to your starred repositories directly on GitHub.')
- [star-me](https://github.com/fossasia/star-me): Star FOSSASIA Repositories on Github and Support the Community. | [homepage](https://github.com/fossasia/star-me 'Star FOSSASIA Repositories on Github and Support the Community.')

<!-- Markdown link & img dfn's -->

[npm-image]: https://img.shields.io/npm/v/reposier.svg
[npm-downloads]: https://img.shields.io/npm/dt/reposier.svg
[npm-url]: https://www.npmjs.com/package/reposier
