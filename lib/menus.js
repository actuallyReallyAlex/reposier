const inquirer = require('inquirer')
const clear = require('clear')
const Configstore = require('configstore')
const conf = new Configstore('reposier')
const ora = require('ora')

const { printTitle, createMenu, timeout } = require('./helpers')
const {
  generateToken,
  getListOfStarredRepos,
  transferStars,
  parseRepoData,
  exportStarredRepoList
} = require('./requests')

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
    'Generate List of Starred Repositories',
    '"Transfer" Starred Repositories',
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

/**
 * Settings Menu
 */
const settingsMenu = {
  type: 'list',
  name: 'settings',
  message: 'SETTINGS',
  choices: ['Edit Account', separator(), 'Main Menu', 'Exit']
}

/**
 * Account Menu
 */
const accountMenu = {
  type: 'list',
  name: 'account',
  message: 'ACCOUNT',
  choices: ['Generate a New Token', separator(), 'Back', 'Exit']
}

/**
 * Redo Token Menu
 */
const redoTokenMenu = {
  type: 'list',
  name: 'redoToken',
  message:
    'This will overwrite your currently saved token.\nYou will also need to provide your password again.\nAre you sure you want to proceed?',
  choices: ['Yes', separator(), 'No (Back)']
}

const transferStarsMenu = {
  type: 'list',
  name: 'transfer',
  message:
    'Please specify which GitHub account you would like to transfer stars FROM:',
  choices: [conf.get('username'), 'Other Account']
}

const transferStarsCurrentAccountMenu = [
  {
    type: 'input',
    name: 'transferToUsername',
    message:
      'Please specify the username of the GitHub account you would like to transfer stars TO:',
    validate: function(value) {
      if (value.length) {
        return true
      } else {
        return "Please enter the account's username."
      }
    }
  },
  {
    type: 'password',
    name: 'transferToPassword',
    message:
      'Please specify the password of the GitHub account you would like to transfer stars TO:',
    validate: function(value) {
      if (value.length) {
        return true
      } else {
        return "Please enter the account's password."
      }
    }
  }
]

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
  const saveCredentialsSpinner = ora('Saving credentials ...').start()
  // Set configuration
  conf.set('username', answer.username)
  conf.set('password', answer.password)
  conf.set('firstTime', false)

  if (conf.has('password')) {
    saveCredentialsSpinner.succeed('Successfully saved credentials.')
  } else {
    saveCredentialsSpinner.fail(
      'An error occured while saving your credentials.'
    )
  }

  generateToken()
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
    const correspondingPreviousMenu = allMenus.find(
      obj => obj.name === previousMenu
    )

    clear()
    printTitle(correspondingPreviousMenu.title)
    // ! May run into a problem if you don't provide a previousMenu here.
    // * I think it would depend on if the user went back to the menu you created more than once for some reason.
    createMenu(
      correspondingPreviousMenu.prompt,
      correspondingPreviousMenu.response,
      correspondingPreviousMenu.menuType
    )
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
  // What will occur when the user selects 'Generate List of Starred Repositories'
  const generateListOfStarredReposResponse = () => {
    getListOfStarredRepos()
      .then(arrayOfRepos => {
        const numberOfStarredRepos = arrayOfRepos.length

        var jsonData = [
          {
            h1: 'Your Starred Repositories'
          },
          {
            p: `You have ${numberOfStarredRepos} repos starred.`
          }
        ]

        arrayOfRepos.forEach(repo => {
          parseRepoData(jsonData, arrayOfRepos, repo)
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

        exportStarredRepoList(jsonData)
      })
      .catch(err => console.log(err))
  }

  // What will occur when the user selects '"Transfer" Starred Repositories'
  // ! Make sure to go back and make this disabled if the user hasn't saved the first account
  const transferStarredReposResponse = () => {
    clear()
    printTitle('Transfer Stars')
    createMenu(transferStarsMenu, transferStarsReponse, 'transfer', 'main')
  }
  // What will occur when the user selects 'Function 3'
  const function3Response = () => {
    console.log('FUNCTION3 REPONSE')
  }
  // What will occur when the user selects 'Settings'
  const settingsResponse = () => {
    clear()
    printTitle('Settings Menu')
    createMenu(settingsMenu, settingsMenuResponse, 'settings', 'main')
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
      name: 'Generate List of Starred Repositories',
      response: generateListOfStarredReposResponse
    },
    {
      name: '"Transfer" Starred Repositories',
      response: transferStarredReposResponse
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

const settingsMenuResponse = (answer, questions, menuType, previousMenu) => {
  const editAccountResponse = () => {
    clear()
    printTitle('Account Menu')
    console.log('Username: ')
    console.log(`\t ${conf.get('username')}`)
    console.log('Token: ')
    console.log(`\t ${conf.get('token')}`)
    console.log('')
    createMenu(accountMenu, accountMenuResponse, 'account', 'settings')
  }

  const mainMenuResponse = () => {
    clear()
    printTitle('Main Menu')
    createMenu(mainMenu, mainResponse, 'main', 'settings')
  }

  const exitResponse = () => {
    clear()
    printTitle('Exit Menu')
    createMenu(exitMenu, exitMenuResponse, 'exit', 'settings')
  }

  const possibleResponses = [
    {
      name: 'Edit Account',
      response: editAccountResponse
    },
    {
      name: 'Main Menu',
      response: mainMenuResponse
    },
    {
      name: 'Exit',
      response: exitResponse
    }
  ]

  // Interpret the answer given by the user and call the appropriate response.
  interpretResponse(possibleResponses, answer, questions)
}

const redoTokenResponse = (answer, questions) => {
  const reEnterPassMenu = {
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

  const reEnterPassResponse = (answer, questions) => {
    conf.set('password', answer.password)
    overwriteToken()
  }

  const yesResponse = () => {
    clear()
    createMenu(reEnterPassMenu, reEnterPassResponse, 'pass')
  }

  const noResponse = () => {
    clear()
    printTitle('Account Menu')
    console.log('Username: ')
    console.log(`\t ${conf.get('username')}`)
    console.log('Token: ')
    console.log(`\t ${conf.get('token')}`)
    console.log('')
    createMenu(accountMenu, accountMenuResponse, 'account')
  }

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

const accountMenuResponse = (answer, questions) => {
  const generateTokenResponse = () => {
    createMenu(redoTokenMenu, redoTokenResponse, 'redoToken', 'account')
  }

  const backResponse = () => {
    clear()
    printTitle('Settings Menu')
    createMenu(settingsMenu, settingsMenuResponse, 'settings', 'account')
  }

  const exitResponse = () => {
    clear()
    printTitle('Exit Menu')
    createMenu(exitMenu, exitMenuResponse, 'exit', 'account')
  }

  const possibleResponses = [
    {
      name: 'Generate a New Token',
      response: generateTokenResponse
    },
    {
      name: 'Back',
      response: backResponse
    },
    {
      name: 'Exit',
      response: exitResponse
    }
  ]

  // Interpret the answer given by the user and call the appropriate response.
  interpretResponse(possibleResponses, answer, questions)
}

const transerStarsCurrentAccountResponse = (answer, questions) => {
  conf.set('tempUsername', answer.transferToUsername)
  conf.set('tempPassword', answer.transferToPassword)

  transferStars()
}

const transferStarsReponse = (answer, questions) => {
  const currentAccountResponse = () => {
    console.log('')
    createMenu(
      transferStarsCurrentAccountMenu,
      transerStarsCurrentAccountResponse,
      'transfer'
    )
  }

  const otherAccountResponse = () => {
    console.log('RESPONSE2')
  }

  const possibleResponses = [
    {
      name: conf.get('username'),
      response: currentAccountResponse
    },
    {
      name: 'Other Account',
      response: otherAccountResponse
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
  },
  {
    name: 'settings',
    title: 'Settings Menu',
    prompt: settingsMenu,
    response: settingsMenuResponse,
    menuType: 'settings'
  },
  {
    name: 'account',
    title: 'Account Menu',
    prompt: accountMenu,
    response: accountMenuResponse,
    menuType: 'account'
  },
  {
    name: 'transfer',
    title: 'Transfer Stars',
    prompt: transferStarsMenu,
    response: transferStarsReponse,
    menuType: 'transfer'
  },
  {
    name: 'transerStarsCurrentAccount',
    title: 'Transfer Stars',
    prompt: transferStarsCurrentAccountMenu,
    response: transerStarsCurrentAccountResponse,
    menuType: 'transfer'
  }
]

module.exports = {
  setupMenu,
  mainMenu,
  exitMenu,
  setupResponse,
  mainResponse
}
