const Configstore = require('configstore')

const conf = new Configstore('reposier')

/**
 * The response when the user finishes the setup prompt.
 * @param {Object} answer The user's response to the setup prompt. Should contain GitHub username and password.
 */
const setupResponse = answer => {
  console.log('THIS IS THE SETUP RESPONSE')
  console.log(answer)

  // Set configuration
  conf.set('username', answer.username)
  conf.set('password', answer.password)
  conf.set('firstTime', false)
}

/**
 * The response when the user finishes the main menu prompt.
 * @param {Object} answer The user's response to the main menu prompt. Should contain the action to take next.
 */
const mainResponse = answer => {
  console.log('THIS IS THE MAIN RESPONSE')
  console.log(answer)
}

module.exports = {
  setupResponse,
  mainResponse
}
