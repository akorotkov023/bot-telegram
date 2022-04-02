const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')
const token = '5130457258:AAGbh-ZQwMLAoZ6Fw-D7vHVJi2ml1G4PNRo'
const bot = new TelegramApi(token, {polling: true})


const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Сейчас я загадаю цифру от 0 до 9, ты должен отгадать её!`)
    //Случайное число от 0 до 9
    chats[chatId] = Math.floor(Math.random() * 10);
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions)
}

const start = () => {

    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Информация о тебе'},
        {command: '/game', description: 'Игра'},
    ])

    bot.on('message', async msg =>{
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/7.jpg')
            return bot.sendMessage(chatId, 'Добро пожаловать в чат бот!')
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.chat.first_name} ${msg.chat.last_name}`)
        }
        if (text === '/game') {
            return startGame(chatId)
        }

        return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй ещё раз!')
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;

        if (data === '/again') {
            return startGame(chatId)
        }
        if (parseInt(data) === chats[chatId]){
            return bot.sendMessage(chatId, `Поздравляем! Ты угадал цифру: нажал ${data} и бот загадал: ${chats[chatId]}`, againOptions)
        } else return bot.sendMessage(chatId, `К сожалению нет, попробуй ещё раз! нажал ${data} и бот загадал: ${chats[chatId]}`, againOptions)

    })
}

start()
