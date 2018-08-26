const boxen = require('boxen')
const gradient = require('gradient-string')
const figlet = require('figlet')
const isOnline = require('is-online')
const inquirer = require('inquirer')

// Responses for Menus
const { setupResponse, mainResponse } = require('./responses')

/**
 * Displays a title screen in a pastel color.
 * @param {String} title - Text to display in title.
 * @todo - Allow you to pick other gradients.
 */
function printTitle(title) {
  // Print Title Screen in Pastel Color
  console.log(
    boxen(gradient.pastel(figlet.textSync(title)), {
      borderColor: 'magenta',
      borderStyle: 'round',
      float: 'center'
    })
  )
}

function displayNoConnection() {
  console.log('Unfortunately, you do not seem to be connected to the internet.')
  timeout(2000, () => {
    console.log('In order to use Reposier, an internet connection is required.')
  })
  timeout(4000, () => {
    console.log('Please connect to the internet, and run "reposier" again.')
  })
}

function displaySetupWalkthrough() {
  console.log('It looks like this is your first time using Reposier.')
  timeout(2000, () => {
    console.log("Let's walk through the setup process together.")
  })
  timeout(4000, () => {
    console.log(
      '\nThe app will ask you for a username and password. This is only done once.'
    )
  })
  timeout(6000, () => {
    console.log(
      "Your information will not be stored, but it's needed temporarily to create a token.\n"
    )
  })
}

/**
 * Stops the program from continuing for a set duration of milliseconds.
 * @param {Number} ms - Number of milliseconds to wait.
 * @param {Function=} [func=''] - (Optional). Function to call once number of milliseconds to wait has passed.
 * @returns {Promise}
 */
function timeout(ms, func = '') {
  if (func) {
    return new Promise(resolve => setTimeout(resolve, ms))
      .then(func)
      .catch(error => console.log(error))
  } else {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

/**
 * Generates a separator to display in the menu with Inquirer.
 */
function separator() {
  return new inquirer.Separator()
}

/**
 * Creates a menu to display to the user.
 * @param {Array|Object} questions - An array of questions to ask the user, containing a Question Object, or the Question Object directly.
 * @param {String=} [menuType='main'] - A string to indicate which menu should be created. Default is 'main' for Main Menu.
 * @param {String=} [previousMenu='main'] - A string to indicate the previous menu the user was on. Mainly used with the 'Exit' menu.
 * @param {Boolean=} [offlineTesting=false] - Ability to test menu functionality when not connected to internet.
 */
function createMenu(
  questions,
  menuType = 'main',
  previousMenu = 'main',
  offlineTesting = false
) {
  // Detect if user is connected to internet
  if (offlineTesting === true) {
    /**
     * List of Menus
     * Name: Name of Menu
     * Response: Response to be called
     */
    const menus = [
      {
        name: 'setup',
        response: setupResponse
      },
      {
        name: 'main',
        response: mainResponse
      }
    ]

    // Assign the corresponding menu based on the menuName
    const correspondingMenu = menus.find(menu => menu.name === menuType)

    // Show Menu Screen
    inquirer
      // Prompt User
      .prompt(questions)
      // Process User Response
      .then(answer => {
        // * answer is an object with questions.name as the key and the user response as the value
        // Process Answer
        correspondingMenu.response(answer)
      })
      .catch(error => {
        console.log(error)
      })
  } else {
    isOnline().then(online => {
      // If you need to disable features of a menu, do so here
      if (!online) {
        console.log('NOT ONLINE')
        return
      }

      /**
       * List of Menus
       * Name: Name of Menu
       * Response: Response to be called
       */
      const menus = [
        {
          name: 'setup',
          response: setupResponse
        },
        {
          name: 'main',
          response: mainResponse
        }
      ]

      // Assign the corresponding menu based on the menuName
      const correspondingMenu = menus.find(menu => menu.name === menuType)

      // Show Menu Screen
      inquirer
        // Prompt User
        .prompt(questions)
        // Process User Response
        .then(answer => {
          // * answer is an object with questions.name as the key and the user response as the value
          // Process Answer
          correspondingMenu.response(answer)
        })
        .catch(error => {
          console.log(error)
        })
    })
  }
}

module.exports = {
  printTitle,
  timeout,
  separator,
  createMenu,
  displayNoConnection,
  displaySetupWalkthrough
}
