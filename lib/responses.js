/**
 * The response when the user finishes the setup prompt.
 * @param {Object} answer The user's response to the setup prompt. Should contain GitHub username and password.
 */
const setupResponse = answer => {
  console.log('THIS IS THE SETUP RESPONSE')
  console.log(answer)
}

const mainResponse = answer => {
  console.log('THIS IS THE MAIN RESPONSE')
  console.log(answer)
}

module.exports = {
  setupResponse,
  mainResponse
}
