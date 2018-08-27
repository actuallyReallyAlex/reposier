const request = require('request')
const Configstore = require('configstore')
const conf = new Configstore('reposier')
const ora = require('ora')

/**
 * Function to generate a token.
 */
function generateToken() {
  const generateTokenSpinner = ora(
    'Generating token via GitHub API ...'
  ).start()

  const body = {
    scopes: ['repo', 'notifications', 'user'],
    note: 'reposier',
    note_url: 'https://www.reposier.com/',
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET
  }

  const options = {
    url: 'https://api.github.com/authorizations',
    headers: {
      'User-Agent': 'reposier'
    },
    auth: {
      username: conf.get('username'),
      password: conf.get('password')
    },
    json: true,
    body: body
  }

  function callback(error, response, body) {
    if (error) {
      generateTokenSpinner.fail('An error occured while generating your token.')
      console.log('error', error)
    } else {
      const token = body.token
      if (token) {
        generateTokenSpinner.succeed('Successfully generated a token.')

        const removePasswordSpinner = ora(
          'Removing password and replacing with token ...'
        ).start()
        conf.set('token', token)
        conf.set('tokenInformation', body)
        conf.delete('password')
        if (!conf.has('password')) {
          removePasswordSpinner.succeed(
            'Successfully removed password and replaced with token.'
          )
        } else {
          removePasswordSpinner.fail(
            'An error occurred while removing your password.'
          )
        }
      }
    }
  }
  request.post(options, callback)
}

function overwriteToken() {
  const overwriteTokenSpinner = ora(
    'Generating a new token via GitHub API ...'
  ).start()

  const body = {
    scopes: ['repo', 'notifications', 'user'],
    note: 'reposier',
    note_url: 'https://www.reposier.com/',
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET
  }

  const options = {
    url: 'https://api.github.com/authorizations',
    headers: {
      'User-Agent': 'reposier'
    },
    auth: {
      username: conf.get('username'),
      password: conf.get('password')
    },
    json: true,
    body: body
  }

  function callback(error, response, body) {
    if (error) {
      overwriteTokenSpinner.fail('An error occured while generating your token.')
      console.log('error', error)
    } else {
      const token = body.token
      if (token) {
        overwriteTokenSpinner.succeed('Successfully generated a new token.')

        const removePasswordSpinner = ora(
          'Removing password and replacing new token ...'
        ).start()
        conf.set('token', token)
        conf.set('tokenInformation', body)
        conf.delete('password')
        if (!conf.has('password')) {
          removePasswordSpinner.succeed(
            'Successfully removed password and replaced token.'
          )
        } else {
          removePasswordSpinner.fail(
            'An error occurred while removing your password.'
          )
        }
      }
    }
  }
  request.post(options, callback)
}

module.exports = {
  generateToken,
  overwriteToken
}
