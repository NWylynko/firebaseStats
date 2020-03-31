const firebase = require('./firebase');
const schedule = require('node-schedule');
const express = require('express');
const cors = require('cors');
const app = express()
const port = 5000

const corsOptions = {
  origin: 'https://nick.wylynko.com',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions))

let stats = {}

const miniNotes = firebase.initApp('MiniNotes', "./serviceAccounts/miniNotes.json", "https://mininotes-420.firebaseio.com")
const fountains = firebase.initApp('fountains', "./serviceAccounts/fountains.json", "https://fountains-app.firebaseio.com")
const smallTalk = firebase.initApp('smallTalk', "./serviceAccounts/smallTalk.json", "https://small-talk-666.firebaseio.com")

updateState()

schedule.scheduleJob('0 12 * * *', updateState);

function updateState() {

  stats.miniNotes = {
    loading: true
  }

  miniNotes.database().ref('board').once('value', value => {

    stats.miniNotes.boards = value.numChildren()
    let n = 0
    value.forEach(board => {
      n += board.numChildren()
    })
    stats.miniNotes.notes = n
  }).then(() => { stats.miniNotes.loading = false })
    .catch(err => {console.warn(err); stats.miniNotes.error = true})

  stats.fountains = {
    loading: true
  }

  fountains.database().ref('locations').once('value', value => {
    stats.fountains.locations = value.numChildren()
  }).then(() => { stats.fountains.loading = false })
  .catch(err => {console.warn(err); stats.fountains.error = true})

  stats.smallTalk = {
    loading: true
  }

  smallTalk.database().ref('msg').once('value', value => {
    stats.smallTalk.chats = value.numChildren()
    let n = 0
    value.forEach(message => {
      n += message.numChildren()
    })
    stats.smallTalk.messages = n
  }).then(() => { stats.smallTalk.loading = false })
  .catch(err => {console.warn(err); stats.smallTalk.error = true})

  stats.lastUpdated = Date.now()
  console.log('updated stats')

}

app.get('/stats', (req, res) => { res.json(stats) })

app.listen(port, () => console.log(`listening on port ${port}`))
