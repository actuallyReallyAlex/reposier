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

![Installing from NPM](https://res.cloudinary.com/alexlee-dev/image/upload/v1535747752/reposier/install.svg)

## Usage Examples

### Initial Setup

```sh
reposier
```

Follow the prompts to set up your user credentials.

![Setting up reposier](https://res.cloudinary.com/alexlee-dev/image/upload/v1535748524/reposier/setup.svg)

### Startup

```sh
reposier
```

![Starting reposier](https://res.cloudinary.com/alexlee-dev/image/upload/v1535748684/reposier/startup.svg)

### Generating List of Starred Repositories

Reposier can generate a markdown file to display information about the repositories you have currently starred.
Currently, markdown is the only supported filetype. In a future update, HTML and other file types will be implemented as well.
The maximum amount of starred repositories reposier can generate a list for is 100. If you would like support for more than 100 repos, open an issue.

```sh
reposier
❯ Generate List of Starred Repositories
```

![Generate List of Starred Repositories](https://res.cloudinary.com/alexlee-dev/image/upload/v1535748940/reposier/generateList.svg)

[Example Markdown file](https://github.com/alexlee-dev/reposier/blob/master/examples/exports/md/starredRepos.md)

### "Transfer" Starred Repositories

Reposier can "transfer" starred repositories from one account to another. This can be useful if one of your GitHub accoumts has some repos starred, and you'd like them on one of your other accounts. This functionality requires you to have access to both accounts.

#### Transferring from Default User

The account associated with reposier is considered the Default User. You have the option of transferring stars from the default user to another user account.

```sh
reposier
❯ "Transfer" Starred Repositories
❯ DEFAULT USER
```

![Transferring from Default User](https://res.cloudinary.com/alexlee-dev/image/upload/v1535749729/reposier/fromDefaultToOther.svg)

#### Transferring from Other User

This option will transfer starred repos from another user account to the default user.

```sh
reposier
❯ "Transfer" Starred Repositories
❯ Other Account
```

![Transferring from Other User](https://res.cloudinary.com/alexlee-dev/image/upload/v1535750263/fromOtherToDefault.svg)

### Viewing Credentials

You can also view your associated user account and token.

```sh
reposier
❯ Settings
❯ Edit Account
```

![Viewing account credentials in reposier](https://res.cloudinary.com/alexlee-dev/image/upload/v1535750543/reposier/viewCredentials.svg)

### Exiting Program

```sh
reposier
❯ Exit
❯ Yes
```

![Exiting reposier](https://res.cloudinary.com/alexlee-dev/image/upload/v1535750701/exit.svg)

## Uninstall

```sh
npm uninstall -g reposier
```

![Uninstalling reposier](https://res.cloudinary.com/alexlee-dev/image/upload/v1535750877/reposier/uninstall.svg)

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
