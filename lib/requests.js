const request = require('request')
const Configstore = require('configstore')
const conf = new Configstore('reposier')
const ora = require('ora')
const octokit = require('@octokit/rest')({ debug: false })

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

function generateToken() {
  const generateTokenSpinner = ora('Generating token ...').start()
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
  }
}

module.exports = {
  generateToken
}
