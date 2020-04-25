const firebase = require('./firebase');
const schedule = require('node-schedule');
const express = require('express');
const cors = require('cors');
const app = express()
const port = 5000

console.log(`starting on ${Date()}`)

const corsOptions = {
  origin: 'https://nick.wylynko.com',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions))

let stats = {}

let miniNotes;
let fountains;
let smallTalk;

try {
  miniNotes = firebase.initApp('MiniNotes', "./serviceAccounts/miniNotes.json", "https://mininotes-420.firebaseio.com")
} catch (error) {
  console.error(error)
}

try {
  fountains = firebase.initApp('fountains', "./serviceAccounts/fountains.json", "https://fountains-app.firebaseio.com")
} catch (error) {
  console.error(error)
}

try {
  smallTalk = firebase.initApp('smallTalk', "./serviceAccounts/smallTalk.json", "https://small-talk-666.firebaseio.com")
} catch (error) {
  console.error(error)
}

updateState()

schedule.scheduleJob('0 12 * * *', updateState);

function updateState() {

  try {

    stats.miniNotes = {
      loading: true
    }

    if (miniNotes) {

      miniNotes.database().ref('board').once('value', value => {

        stats.miniNotes.boards = value.numChildren()
        let n = 0
        value.forEach(board => {
          n += board.numChildren()
        })
        stats.miniNotes.notes = n
      }).then(() => { stats.miniNotes.loading = false })
        .catch(err => { console.error(err); stats.miniNotes.error = true; })

    } else {
      stats.miniNotes.error = true;
      stats.miniNotes.loading = false;
      console.error('miniNotes isnt defined')
    }


    stats.fountains = {
      loading: true
    }

    if (fountains) {
      fountains.database().ref('locations').once('value', value => {
        stats.fountains.locations = value.numChildren()
      }).then(() => { stats.fountains.loading = false })
        .catch(err => { console.error(err); stats.fountains.error = true; })
    } else {
      stats.fountains.error = true;
      stats.fountains.loading = false;
      console.error('fountains isnt defined')
    }


    stats.smallTalk = {
      loading: true
    }

    if (smallTalk) {
      smallTalk.database().ref('msg').once('value', value => {
        stats.smallTalk.chats = value.numChildren()
        let n = 0
        value.forEach(message => {
          n += message.numChildren()
        })
        stats.smallTalk.messages = n
      }).then(() => { stats.smallTalk.loading = false })
        .catch(err => { console.error(err); stats.smallTalk.error = true; })
    } else {
      stats.smallTalk.error = true;
      stats.smallTalk.loading = false;
      console.error('smallTalk isnt defined')
    }

    stats.lastUpdated = Date.now()
    stats.lastUpdatedFormatted = Date()

    console.log('updated stats')
  } catch (error) {

    console.error(error)

  }

}

app.get('/stats', (req, res) => { res.json(stats) })

app.listen(port, () => console.log(`listening on port ${port}`))
