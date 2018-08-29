const Configstore = require('configstore')
const conf = new Configstore('reposier')
const ora = require('ora')
const octokit = require('@octokit/rest')({ debug: true })
const fs = require('fs')
const chalk = require('chalk')
const json2md = require('json2md')
const moment = require('moment')

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
 */
function getStarredRepos() {
  // Get Username
  const username = conf.get('username')
  const getStarredReposSpinner = ora(
    `Getting list of starred repos for ${chalk.green('USERNAME')} ...`
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
          'USERNAME'
        )}.`
      )
      const writingDataSpinner = ora('Writing data to file ...').start()
      const arrayOfAllStarredRepos = result.data
      const numberOfStarredRepos = arrayOfAllStarredRepos.length
      var jsonData = [
        {
          h1: 'Your Starred Repositories'
        },
        {
          p: `You have ${numberOfStarredRepos} repos starred.`
        }
      ]
      // Go through array of users' starr repos and parse data
      arrayOfAllStarredRepos.forEach(repo => {
        parseRepoData(jsonData, arrayOfAllStarredRepos, repo)
      })
      // Add link to bottom of markdown, linking to reposier
      const linkBreak = {
        p: '---'
      }
      const attribution = {
        h6: [
          'This list was automatically generated by [reposier](https://www.reposier.com/)'
        ]
      }
      jsonData.push(linkBreak)
      jsonData.push(attribution)
      const mdOutput = json2md(jsonData)
      // Create Directory
      const createDirectorySpinner = ora(
        'Creating export directory ...'
      ).start()
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
                  fs.writeFile(
                    './exports/md/starredRepos.md',
                    mdOutput,
                    error => {
                      if (error) {
                        writingDataSpinner.fail(
                          'Error occured when saving data.'
                        )
                        console.log(error)
                      } else {
                        writingDataSpinner.succeed(
                          `File saved at ${chalk.green(
                            './exports/md/starredRepos.md'
                          )}.`
                        )
                      }
                    }
                  )
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
                  fs.writeFile(
                    './exports/md/starredRepos.md',
                    mdOutput,
                    error => {
                      if (error) {
                        writingDataSpinner.fail(
                          'Error occured when saving data.'
                        )
                        console.log(error)
                      } else {
                        writingDataSpinner.succeed(
                          `File saved at ${chalk.green(
                            './exports/md/starredRepos.md'
                          )}.`
                        )
                      }
                    }
                  )
                }
              })
            } else {
              createDirectorySpinner.succeed('Directory exists.')
              // MD directory DOES exist
              // Write or Overwrite file
              fs.writeFile(
                './exports/md/starredRepos.md',
                mdOutput,
                error => {
                  if (error) {
                    writingDataSpinner.fail(
                      'Error occured when saving data.'
                    )
                    console.log(error)
                  } else {
                    writingDataSpinner.succeed(
                      `File saved at ${chalk.green(
                        './exports/md/starredRepos.md'
                      )}.`
                    )
                  }
                }
              )
            }
          })
        }
      })
    })
    .catch(error => {
      getStarredReposSpinner.fail(
        "An error occured while contacting GitHub's API."
      )
      console.log(error)
    })
}

module.exports = {
  generateToken,
  getStarredRepos
}
