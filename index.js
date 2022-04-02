const TelegramApi = require('node-telegram-bot-api')
const token = '5130457258:AAGbh-ZQwMLAoZ6Fw-D7vHVJi2ml1G4PNRo'
const bot = new TelegramApi(token, {polling: true})

const chats = {}

const gameOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: '1', callback_data: '1'}, {text: '2', callback_data: '2'}, {text: '3', callback_data: '3'}],
            [{text: '4', callback_data: '4'}, {text: '5', callback_data: '5'}, {text: '6', callback_data: '6'}],
            [{text: '7', callback_data: '7'}, {text: '8', callback_data: '8'}, {text: '9', callback_data: '9'}],
            [{text: '0', callback_data: '0'}]
        ]
    })
}

const againOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: 'Играть ещё раз!', callback_data: '/again'}]
        ]
    })
}

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
