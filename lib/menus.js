const inquirer = require('inquirer')

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

module.exports = {
  setupMenu,
  mainMenu
}
