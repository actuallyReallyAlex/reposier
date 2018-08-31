const Configstore = require('configstore')
const conf = new Configstore('reposier')
const ora = require('ora')
const fs = require('fs')
const chalk = require('chalk')
const json2md = require('json2md')
const moment = require('moment')
const difference = require('lodash.difference')
const _progress = require('cli-progress')

const { timeout } = require('./helpers')

/**
 * Deletes the password in the config file, and saves the token & token information.
 * @param {String} token The user's token.
 * @param {Object} tokenInfo An object of info generated from the original request to GitHub's API.
 */
function replacePassWithToken(token, tokenInfo) {
  const removePasswordSpinner = ora(
    'Removing password and replacing with token ...'
  ).start()
  conf.set('token', token)
  conf.set('tokenInformation', tokenInfo)
  conf.delete('password')
  if (!conf.has('password')) {
    removePasswordSpinner.succeed(
      'Successfully removed password and replaced with token.'
    )
    console.log(
      `\nTo view or revoke authorization for reposier, go to https://github.com/settings/connections/applications/${
        process.env.CLIENT_ID
      }`
    )
  } else {
    removePasswordSpinner.fail(
      'An error occurred while removing your password.'
    )
  }
}

/**
 * Generates a token for the app to use in later API calls if needed.
 */
function generateToken() {
  const octokit = require('@octokit/rest')({ debug: false })

  const generateTokenSpinner = ora('\nGenerating token ...').start()
  if (conf.has('username') === false || conf.has('password') === false) {
    generateTokenSpinner.fail(
      'reposier could not find a username or password in your configuration.'
    )
  } else {
    octokit.authenticate({
      type: 'basic',
      username: conf.get('username'),
      password: conf.get('password')
    })

    octokit.authorization
      .getOrCreateAuthorizationForApp({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        scopes: ['repo', 'notifications', 'user'],
        note: 'reposier',
        note_url: 'https://www.reposier.com/'
      })
      .then(result => {
        // Successfully created a new token
        if (result.status === 201) {
          const token = result.data.token
          generateTokenSpinner.succeed('Successfully created new token.')
          // Change out password with token, and save info about request
          replacePassWithToken(token, result.data)
        } else if (result.status === 200) {
          // User already had a token
          generateTokenSpinner.succeed('Token already exists.')
          replacePassWithToken('UNDEFINED', result.data)
        } else {
          // Failed request
          generateTokenSpinner.fail('Failed to create a token.')
        }
      })
      .catch(error => {
        generateTokenSpinner.fail(
          "An error occured while contacting GitHub's API."
        )
        console.log(error)
      })
  }
}

/**
 * Adds custom converter for json2md to add a link as markdown.
 * @param {*} input - Input to be converted.
 * @param {*} json2md Used to call json2md.
 */
json2md.converters.link = function(input, json2md) {
  const splitUp = input.split('%%%')
  const text = splitUp[0]
  const url = splitUp[1]
  return `[${text}](${url})`
}

/**
 * Add custom converter for json2md to add italics as markdown.
 * @param {*} input Input to be converted.
 * @param {*} json2md Used to call json2md.
 */
json2md.converters.italics = function(input, json2md) {
  return `_${input}_`
}

/**
 * Use momentJS to format a date into a more readable format.
 * @param {String} date A string in an unfriendly date format. Ex: '2018-05-22T05:58:14Z'.
 */
function prettyDate(date) {
  return moment(date).format('MMMM Do YYYY, h:mm:ss A')
}

/**
 * Parses data from API request to prepare json2md.
 * @param {Array} jsonArray Array of JSON data to be parsed by json2md.
 * @param {Array} repoArray Array of all starred repositories.
 * @param {Object} data Object of specific repository to be parsed.
 */
function parseRepoData(jsonArray, repoArray, data) {
  // Number of Starred Repo
  const index = repoArray.indexOf(data) + 1
  // Name
  const repoName = data.repo.name
  // URL
  const url = data.repo['html_url']
  const repoNameObj = { h2: { link: `#${index}. ${repoName}%%%${url}` } }
  jsonArray.push(repoNameObj)
  // Description
  const description = data.repo.description
  if (description) {
    const descriptionObj = { blockquote: `${description}` }
    jsonArray.push(descriptionObj)
  } else {
    const descriptionObj = {
      blockquote: 'No description, website, or topics provided.'
    }
    jsonArray.push(descriptionObj)
  }

  // Table of Information
  var tableInfo = {
    author: '',
    language: '',
    stargazers: '',
    forks: '',
    starredAt: '',
    createdAt: '',
    lastUpdated: ''
  }
  // Author
  const author = data.repo.owner.login
  if (author) {
    const url = data.repo.owner['html_url']
    const imageUrl = data.repo.owner['avatar_url']
    if (imageUrl) {
      // Asks server to send back an image that is 50px
      const shrunkImgUrl = imageUrl.concat('&s=50')
      tableInfo.author = `![${author}](${shrunkImgUrl})[${author}](${url})`
    } else {
      tableInfo.author = `[${author}](${url})`
    }
  }
  // Language
  const language = data.repo.language
  if (language) {
    tableInfo.language = language
  } else {
    tableInfo.language = '(Not Specified)'
  }
  // Stargazers
  const stargazers = data.repo['stargazers_count']
  if (stargazers) {
    tableInfo.stargazers = stargazers.toLocaleString()
  }
  // Forks
  const forks = data.repo['forks_count']
  if (forks) {
    tableInfo.forks = forks.toLocaleString()
  }
  // Starred At
  const starredAt = data['starred_at']
  if (starredAt) {
    tableInfo.starredAt = prettyDate(starredAt)
  }
  // Created At
  const createdAt = data.repo['created_at']
  if (createdAt) {
    tableInfo.createdAt = prettyDate(createdAt)
  }
  // Last Updated
  const lastUpdated = data.repo['updated_at']
  if (lastUpdated) {
    tableInfo.lastUpdated = prettyDate(lastUpdated)
  }
  const tableObj = {
    table: {
      headers: [
        'Author',
        'Language',
        'Stargazers',
        'Forks',
        'Starred At',
        'Created At',
        'Last Updated'
      ],
      rows: [
        [
          tableInfo.author,
          tableInfo.language,
          tableInfo.stargazers,
          tableInfo.forks,
          tableInfo.starredAt,
          tableInfo.createdAt,
          tableInfo.lastUpdated
        ]
      ]
    }
  }
  jsonArray.push(tableObj)
}

/**
 * Function to get a list of the user's starred repositories.
 * @param {String} user - Defaults to "current". Defines who is being searched for.
 * @returns {Promise} - Returns a promise that resolves to an array of starred repositories, and rejects to an error.
 */
function getListOfStarredRepos(user = 'current') {
  const octokit = require('@octokit/rest')({ debug: false })

  if (user !== 'current') {
    // Getting List of Starred Repos for Temp User
    return new Promise((resolve, reject) => {
      // Get Username
      const username = conf.get('tempUsername')
      const password = conf.get('tempPassword')
      const getStarredReposSpinner = ora(
        `Getting list of starred repos for ${chalk.green(username)} ...`
      ).start()
      // Authenticate request to GitHub API
      octokit.authenticate({
        type: 'basic',
        username: username,
        password: password
      })

      // Make request to GitHub API
      octokit.activity
        // Max Repos Per Page: 100 (Default is 30).
        // * If user has over 100 starred repos, need to use pagination
        // * Future patch
        .getStarredRepos({ per_page: 100 })
        .then(result => {
          // Result is a JSON object with data and headers of the request
          getStarredReposSpinner.succeed(
            `Successfully generated list of starred repos for ${chalk.green(
              username
            )}.`
          )
          const arrayOfAllStarredRepos = result.data

          resolve(arrayOfAllStarredRepos)
        })
        .catch(error => {
          getStarredReposSpinner.fail(
            "An error occured while contacting GitHub's API."
          )
          console.log(error)
          reject(error)
        })
    })
  } else {
    return new Promise((resolve, reject) => {
      // Get Username
      const username = conf.get('username')
      const getStarredReposSpinner = ora(
        `Getting list of starred repos for ${chalk.green(username)} ...`
      ).start()
      // Authenticate request to GitHub API
      octokit.authenticate({
        type: 'oauth',
        token: conf.get('token')
      })

      // Make request to GitHub API
      octokit.activity
        // Max Repos Per Page: 100 (Default is 30).
        // * If user has over 100 starred repos, need to use pagination
        // * Future patch
        .getStarredRepos({ per_page: 100 })
        .then(result => {
          // Result is a JSON object with data and headers of the request
          getStarredReposSpinner.succeed(
            `Successfully generated list of starred repos for ${chalk.green(
              username
            )}.`
          )
          const arrayOfAllStarredRepos = result.data

          resolve(arrayOfAllStarredRepos)
        })
        .catch(error => {
          getStarredReposSpinner.fail(
            "An error occured while contacting GitHub's API."
          )
          console.log(error)
          reject(error)
        })
    })
  }
}

function extractReposAndOwners(arrayOfRepos) {
  let array = []
  arrayOfRepos.forEach(repo => {
    const repoName = repo.repo.name
    const owner = repo.repo.owner.login

    const repoObj = {
      repo: repoName,
      owner: owner
    }

    array.push(repoObj)
  })
  return array
}

/**
 * "Transfers" starred repos from one account to another.
 * @param {String} accountFrom Which account to transfer stars FROM. Either "current" by default, or "temp".
 */
function transferStars(accountFrom = 'current') {
  // TODO: Add ability to generate report of what repos were "transfered"
  // TODO: Progress bar might not be working. Or requests are just going very quickly.

  // 1. First, get list of starred repos for both account
  // ** need to compare which repos you don't need to re-star
  // ** Get list of starred repos for current user
  // ** Then get list of starred repos for the temp user
  // 2. Compare the 2 lists
  // ** If there are any repos that are not on the original list, star them.

  // Set content-length to 0 for this type of request.
  const octokit = require('@octokit/rest')({
    headers: {
      'Content-Length': 0
    }
  })

  // 1.
  if (accountFrom === 'current') {
    // Get list of starred repos for current user.
    getListOfStarredRepos()
      .then(result => {
        // Go through each repo, and pull out just the name and the author
        const currentUserRepos = extractReposAndOwners(result)

        // Get List of Starred Repos for Temporary User
        getListOfStarredRepos(conf.get('tempUsername'))
          .then(result => {
            // Go through each repo, and pull out just the name and the author
            const tempUserRepos = extractReposAndOwners(result)

            // 2. Compare the 2 lists of repos
            // Create a new list of the difference using lodash
            const reposToStar = difference(currentUserRepos, tempUserRepos)
            const numberOfReposToStar = reposToStar.length

            // Set up progress bar
            const bar = new _progress.Bar()
            bar.start(numberOfReposToStar, 0)

            // Star each of those repos for the temporaryUser
            reposToStar.forEach(repository => {
              const index = reposToStar.indexOf(repository) + 1
              octokit.authenticate({
                type: 'basic',
                username: conf.get('tempUsername'),
                password: conf.get('tempPassword')
              })
              octokit.activity
                .starRepo({ owner: repository.owner, repo: repository.repo })
                .then(result => {
                  // At the last repo, log info about the ratelimit
                  if (index === reposToStar.length) {
                    logRateLimit(result)
                  }
                })
                .catch(error => console.log(error))
              // Increment bar by 1 each time.
              bar.increment()
            })
            // Stop progress bar
            bar.stop()

            // Remember to delete temporary user info from config
            deleteTemporaryUserInfo()
          })
          .catch(error => {
            console.log(error)
            deleteTemporaryUserInfo()
          })
      })
      .catch(error => {
        console.log(error)
        deleteTemporaryUserInfo()
      })
  } else {
    // Get list of starred repos for current user.
    getListOfStarredRepos()
      .then(result => {
        // Go through each repo, and pull out just the name and the author
        const currentUserRepos = extractReposAndOwners(result)

        // Get List of Starred Repos for Temporary User
        getListOfStarredRepos(conf.get('tempUsername'))
          .then(result => {
            // Go through each repo, and pull out just the name and the author
            const tempUserRepos = extractReposAndOwners(result)

            // Compare the 2 lists of repos
            // Create a new list of the difference using lodash
            const reposToStar = difference(tempUserRepos, currentUserRepos)
            const numberOfReposToStar = reposToStar.length

            // Set up progress bar
            const bar = new _progress.Bar()
            bar.start(numberOfReposToStar, 0)

            // Star each of those repos for the temporaryUser
            reposToStar.forEach(repository => {
              const index = reposToStar.indexOf(repository) + 1
              octokit.authenticate({
                type: 'oauth',
                token: conf.get('token')
              })
              octokit.activity
                .unstarRepo({ owner: repository.owner, repo: repository.repo })
                .then(result => {
                  // At the last repo, log info about the ratelimit
                  if (index === reposToStar.length) {
                    logRateLimit(result)
                  }
                })
                .catch(error => console.log(error))
              // Increment bar by 1 each time.
              bar.increment()
            })
            // Stop progress bar
            bar.stop()

            // Remember to delete temporary user info from config
            deleteTemporaryUserInfo()
          })
          .catch(error => {
            console.log(error)
            deleteTemporaryUserInfo()
          })
      })
      .catch(error => {
        console.log(error)
        deleteTemporaryUserInfo()
      })
  }
}

function logRateLimit(response) {
  console.log('')
  const rateLimitRemaining = response.headers['x-ratelimit-remaining']
  const timeToReset = moment(
    parseFloat(response.headers['x-ratelimit-reset'])
  ).format('mm[ minutes and ]ss[ seconds]')

  console.log(
    `You have ${chalk.green(
      rateLimitRemaining
    )} requests remaining for the next ${chalk.green(timeToReset)}.`
  )
}

function deleteTemporaryUserInfo() {
  conf.delete('tempUsername')
  conf.delete('tempPassword')
}

function exportStarredRepoList(jsonArray) {
  const writingDataSpinner = ora('Writing data ...').start()
  // Output variable transformed using json2md
  const mdOutput = json2md(jsonArray)
  // Create Directory
  const createDirectorySpinner = ora('Creating export directory ...').start()
  // Test if the Exports Directory exists
  fs.access('./exports', error => {
    if (error) {
      // Exports directory does not exist
      // * Need to create directory
      fs.mkdir('./exports/', error => {
        if (error) {
          createDirectorySpinner.fail(
            'An error occured while creating the directory, "./exports/"'
          )
          console.log(error)
        } else {
          fs.mkdir('./exports/md/', error => {
            if (error) {
              createDirectorySpinner.fail(
                'An error occured while creating the directory, "./exports/md".'
              )
            } else {
              createDirectorySpinner.succeed(
                `Created directory at ${chalk.green('./exports/md')}.`
              )
              fs.writeFile('./exports/md/starredRepos.md', mdOutput, error => {
                if (error) {
                  writingDataSpinner.fail('Error occured when saving data.')
                  console.log(error)
                } else {
                  writingDataSpinner.succeed(
                    `File saved at ${chalk.green(
                      './exports/md/starredRepos.md'
                    )}.`
                  )
                }
              })
            }
          })
        }
      })
    } else {
      // Exports directory DOES exist
      // * Check if md directory exists
      fs.access('./exports/md', error => {
        if (error) {
          console.log(error)
          // MD directory does not exist
          // * Need to create directory
          fs.mkdir('./exports/md/', error => {
            if (error) {
              createDirectorySpinner.fail(
                'An error occured while creating the directory, "./exports/md".'
              )
            } else {
              createDirectorySpinner.succeed(
                `Created directory at ${chalk.green('./exports/md')}.`
              )
              fs.writeFile('./exports/md/starredRepos.md', mdOutput, error => {
                if (error) {
                  writingDataSpinner.fail('Error occured when saving data.')
                  console.log(error)
                } else {
                  writingDataSpinner.succeed(
                    `File saved at ${chalk.green(
                      './exports/md/starredRepos.md'
                    )}.`
                  )
                }
              })
            }
          })
        } else {
          createDirectorySpinner.succeed('Directory exists.')
          // MD directory DOES exist
          // Write or Overwrite file
          fs.writeFile('./exports/md/starredRepos.md', mdOutput, error => {
            if (error) {
              writingDataSpinner.fail('Error occured when saving data.')
              console.log(error)
            } else {
              writingDataSpinner.succeed(
                `File saved at ${chalk.green('./exports/md/starredRepos.md')}.`
              )
            }
          })
        }
      })
    }
  })
}

module.exports = {
  generateToken,
  getListOfStarredRepos,
  transferStars,
  parseRepoData,
  exportStarredRepoList
}
