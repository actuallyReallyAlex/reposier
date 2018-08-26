#!/usr/bin/env node

// To print NodeJS errors in a more readable format
require('pretty-error').start()
// To check if user is connected to internet
const isOnline = require('is-online')
// For spinners / loaders
const ora = require('ora')
// Configuration Storage
const Configstore = require('configstore')
// Create a Configuration File with Configstore
const conf = new Configstore('reposier')

// Custom Modules
const {
  printTitle,
  timeout,
  createMenu,
  displayNoConnection,
  displaySetupWalkthrough
} = require('./lib/helpers')
const { setupMenu, mainMenu } = require('./lib/menus')

const test = () => {
  createMenu(mainMenu, 'main', 'none', true)
}

// test()

// Overall functionality
const run = () => {
  // Determine if User is connected to internet
  const connectionSpinner = ora('Testing connection ...').start()

  isOnline().then(online => {
    // If user is connected to internet
    if (online) {
      connectionSpinner.succeed('Connected to internet.')

      // Print Title Screen
      printTitle('reposier')

      // Check if this is first time running program
      if (conf.get('firstTime') !== false) {
        // This is the user's first time
        // Walk user through set-up
        displaySetupWalkthrough()

        // After final statement, prompt user for GitHub username and password
        timeout(8000, () => {
          createMenu(setupMenu, 'setup')
        })
      } else {
        // Create Main Menu
        createMenu(mainMenu, 'main')
      }
    } else {
      // User is not connected to internet
      // Launch app with limited capabilities
      connectionSpinner.fail('Not connected to internet.')

      // Print Title Screen
      printTitle('reposier')

      // Display message to user telling them to connect to the internet
      displayNoConnection()
    }
  })
}

// Run reposier
run()
