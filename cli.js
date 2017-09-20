const
    yargs = require('yargs'),
    game = require('./app')

const flags = yargs.usage('$0: usage --run')
    .options('h', {
        alias: 'help',
        describe: 'display help'
    })
    .options('d', {
        alias: 'difficulty',
        describe: 'set difficulty of game',
        choices: ['hard' , 'easy']
        //array: true
    })
    .argv

if (flags.help)
    yargs.showHelp()

else 
    game.run(flags)