const fs = require('fs')
const colors = require('colors')
const inquirer = require('inquirer')
const path = require('path')
module.exports.run = (flags) => {
    let level = " "
     if(flags.difficulty == 'hard')
    {level = 'hard' }
    
    else
        { level = 'easy' }
    const game = new Game()
    game.init(level)
}

class Game {
    constructor() {
        this.randomWord = []
        this.board = []
        this.guessedWords = []
        this.counter = 0;
        this.sortedArray = []
        this.temp = []
        this.words = []
        this.setLevel = ''
        


        }
    init(level) {
        //console.log(level)
        this.setLevel = level
        if(level == 'easy')
            this.file = './easy.txt'
        else if(level == 'hard')
             this.file = './hard.txt'
        const fullPath = path.resolve(this.file)
        fs.readFile(fullPath, 'utf8',(err, data) => {
            if (err){
                console.log(err)
            }
            this.words = data.trim().split('\n')
            //console.log(words.length)
            //console.log(words)
            //const randomWordIndex = [(Math.floor(Math.random()* (words.length) + 0 ))]
            this.randomWord2 = this.words[Math.floor(Math.random()*this.words.length)].toLowerCase()
            this.randomWord = this.randomWord2.trim()
            for(let i=0; i<this.randomWord.length; i++){
                 this.temp.push(this.randomWord[i].toLowerCase())
            }
            this.sortedArray = this.getHintWord(this.temp)
           // console.log(this.sortedArray)
            //console.log("temp is:"+this.temp)
           //console.log(this.randomWord)
            for(let i=0; i<this.randomWord.length; i++)
                {this.board[i]='_'}
            this.playGame()
            //let boardString = this.board
            
     })
    }     

   getHintWord(array){
    //Sort our random word based on frequency of each word
    //Found this algoritm at: https://gist.github.com/trucy/3344398

    let frequency = {}
    // set all initial frequencies for each word to zero
    array.forEach( (value) => { frequency[value] = 0 })
    // create new array with words and their frequencies
    let uniques = array.filter( (value) => { return ++frequency[value] == 1 })
    return array.sort( (a, b) => { return frequency[a] - frequency[b] })
    }

    playGame(){
        let printBoard = " "
        // for(let i=0; i<this.board.size; i++){
        //     printBoard += ' ' + this.board[i]
        // }
        this.board.forEach((letter, index, board2)=>{
            printBoard += ' ' + board2[index]
        })
        //printBoard = this.board.toString()
        console.log(printBoard.yellow)
         inquirer.prompt([{
            type: 'list',
            name: 'options',
            message: 'What Would You Like To Do?',
            choices: ['Guess a letter.', 'Get a hint.', 'View Guessed Letters'],
            filter: (input) => {
            return input
            }
            }]).then((input) => {
            console.log(input.options)
            if(input.options == 'Guess a letter.') {
            this.GuessLetter(this.randomWord, this.board)
            } 
            else if (input.options == 'Get a hint.') {
            this.displayHint()
            }
            else {
            this.showLettersGuessed()
            }
            })

     }

     displayHint(){
            this.replaceIndexValue = this.temp[0]
            this.replaceIndex = this.randomWord.indexOf(this.replaceIndexValue)
            this.board[this.replaceIndex] =  this.replaceIndexValue
            this.temp.shift()
            this.guessedWords.push(this.replaceIndexValue)
            //console.log(this.temp)
            this.checkWin()
            //this.playGame()
     }


     GuessLetter(){
            inquirer.prompt([{
                type: 'input',
                name: 'answer',
                message: `Enter your guess:`,
                filter: (input) => {
                    return input
                }
            }]).then((input) => {
                this.isRight(input.answer)
            })
     }


    isRight(answer){
        this.guessedWords.push(answer)
        // if(this.randomWord.includes(answer)==false){
        //     this.counter ++
           
        // }
        let state = false
        let charExist = false

        if(this.board.includes(answer)){
            charExist = true
        }
        for(let i=0; i<this.randomWord.length; i++){
            if(answer == this.randomWord[i]){
                this.board[i]=this.randomWord[i]
                
                this.removeIndex2 = this.sortedArray.indexOf(this.randomWord[i])
                this.sortedArray.splice(this.removeIndex2,1)

                state = true
            }
        }
        if(state === false || charExist === true){
                this.counter++
                // console.log(this.counter)
        }
        if(this.counter == 4){
            this.gameOver()
        }
        else{
        this.checkWin()
        }
    }

    showLettersGuessed(){
        console.log("Previous guess: "+this.guessedWords.toString().blue)
        this.playGame()

    }
    checkWin(){
        let winState = new Boolean(false)
        const r1 = this.randomWord.toString()
        const b1 = this.board.toString().split(',').join("")
        //console.log(r1)
        //console.log(b1)

            if(this.randomWord.includes(b1)){
                //console.log(this.printBoard)
                console.log("You Won".green)
                console.log("Word is:" + this.randomWord.toString())
                inquirer.prompt([{
            type: 'list',
            name: 'options',
            message: 'Want to play agian?',
            choices: ['Yes', 'No'],
            filter: (input) => {
            return input
            }
            }]).then((input) => {
            if(input.options == 'Yes') {
            const game = new Game()
            game.init(this.setLevel)
            } 
            else if (input.options == 'No') {
            process.exit()
            }
            })
            }

            else{
                this.playGame()
            }
         
   }

   gameOver(){
    console.log("Game over!!".red)
    console.log("The word was:" + this.randomWord.toString())
    inquirer.prompt([{
            type: 'list',
            name: 'options',
            message: 'Want to play agian?',
            choices: ['Yes', 'No'],
            filter: (input) => {
            return input
            }
            }]).then((input) => {
            if(input.options == 'Yes') {
            const game = new Game()
            game.init(this.setLevel)
            } 
            else if (input.options == 'No') {
            process.exit()
            }
            })
   }
}
