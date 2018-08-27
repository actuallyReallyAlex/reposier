const inquirer = require('inquirer')
const clear = require('clear')
const Configstore = require('configstore')
const conf = new Configstore('reposier')

const { printTitle, createMenu, timeout } = require('./helpers')

/**
 * Generates a separator to display in the menu with Inquirer.
 */
function separator() {
  return new inquirer.Separator()
}

/**
 * Setup Menu
 */
const setupMenu = [
  {
    name: 'username',
    type: 'input',
    message: 'Please enter your GitHub username:',
    validate: function(value) {
      if (value.length) {
        return true
      } else {
        return "Please enter your account's username."
      }
    }
  },
  {
    name: 'password',
    type: 'password',
    message: 'Please enter your GitHub password:',
    validate: function(value) {
      if (value.length) {
        return true
      } else {
        return "Please enter your account's password."
      }
    }
  }
]

/**
 * Main Menu
 */
const mainMenu = {
  type: 'list',
  name: 'main',
  message: 'What would you like to do?',
  choices: [
    'Function 1',
    'Function 2',
    'Function 3',
    separator(),
    'Settings',
    'Exit'
  ]
}

/**
 * Exit Menu
 */
const exitMenu = {
  type: 'list',
  name: 'exit',
  message: 'Are you sure you want to quit Reposier?',
  choices: ['Yes', separator(), 'No (Back)']
}

// RESPONSES

/**
 * Interpret the user's answer from a list of possible responses.
 * @param {Array} possibleResponses An array of possible responses from the user.
 * @param {Object} answer The answer given by the user in the prompt.
 * @param {Object} questions The questions that were given to the user in the prompt.
 */
function interpretResponse(possibleResponses, answer, questions) {
  // Assign a value to the response that was chosen by the user
  const correspondingResponse = possibleResponses.find(
    response => response.name === answer[questions.name]
  )
  // Call the corresponding response, passing the answer and questions as arguments
  correspondingResponse.response(answer, questions)
}

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
 * Defines the actions that will be taken when the user selects an answer from the Exit Menu.
 * @param {Object} answer The answer provided by the user.
 * @param {Array} questions The questions given to the user in the prompt.
 */
const exitMenuResponse = (answer, questions, menuType, previousMenu) => {
  /**
   * What will occur when the user responds 'Yes' in the Exit Menu. Exits program.
   */
  const yesResponse = () => {
    clear()
    printTitle('Goodbye!')
    timeout(2000, clear)
  }

  /**
   * What will occur when the user responds 'No' in the Exit Menu. Returns user to previous screen. This has to be dynamic so the user can exit the program from multiple menus.
   */
  const noResponse = () => {
    // Find the corresponding previous menu
    const correspondingPreviousMenu = allMenus.find(obj => obj.name === previousMenu)

    clear()
    printTitle(correspondingPreviousMenu.title)
    // ! May run into a problem if you don't provide a previousMenu here.
    // * I think it would depend on if the user went back to the menu you created more than once for some reason.
    createMenu(correspondingPreviousMenu.prompt, correspondingPreviousMenu.response, correspondingPreviousMenu.menuType)
  }

  /**
   * An array of possile responses in the Exit Menu.
   */
  const possibleResponses = [
    {
      name: 'Yes',
      response: yesResponse
    },
    {
      name: 'No (Back)',
      response: noResponse
    }
  ]

  // Interpret the answer given by the user and call the appropriate response.
  interpretResponse(possibleResponses, answer, questions)
}

/**
 * The response when the user finishes the main menu prompt.
 * @param {Object} answer The user's response to the main menu prompt. Should contain the action to take next.
 * @param {Object} questions The set of questions that was presented to the user during the main menu.
 */
const mainResponse = (answer, questions) => {
  // What will occur when the user selects 'Function 1'
  const function1Response = () => {
    console.log('FUNCTION1 REPONSE')
  }
  // What will occur when the user selects 'Function 2'
  const function2Response = () => {
    console.log('FUNCTION2 REPONSE')
  }
  // What will occur when the user selects 'Function 3'
  const function3Response = () => {
    console.log('FUNCTION3 REPONSE')
  }
  // What will occur when the user selects 'Settings'
  const settingsResponse = () => {
    console.log('SETTINGS RESPONSE')
  }
  // What will occur when the user selects 'Exit'
  const exitResponse = () => {
    clear()
    printTitle('Exit Menu')
    createMenu(exitMenu, exitMenuResponse, 'exit', 'main')
  }

  // An array containing the name and response for each possible user response in the main menu.
  const possibleResponses = [
    {
      name: 'Function 1',
      response: function1Response
    },
    {
      name: 'Function 2',
      response: function2Response
    },
    {
      name: 'Function 3',
      response: function3Response
    },
    {
      name: 'Settings',
      response: settingsResponse
    },
    {
      name: 'Exit',
      response: exitResponse
    }
  ]

  // Interpret the answer given by the user and call the appropriate response.
  interpretResponse(possibleResponses, answer, questions)
}

/**
 * An array of all menu types. Used in other functions to find a proper previous menu screen to display.
 */
const allMenus = [
  {
    name: 'setup',
    title: 'Setup Menu',
    prompt: setupMenu,
    response: setupResponse,
    menuType: 'setup'
  },
  {
    name: 'main',
    title: 'Main Menu',
    prompt: mainMenu,
    response: mainResponse,
    menuType: 'main'
  },
  {
    name: 'exit',
    title: 'Exit Menu',
    prompt: exitMenu,
    response: exitMenuResponse,
    menuType: 'exit'
  }
]

module.exports = {
  setupMenu,
  mainMenu,
  exitMenu,
  setupResponse,
  mainResponse
}
