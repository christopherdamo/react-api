const env = require('./lib/cli')
const path = require('path')
const { Log } = require('./lib/Log')
const log = new Log('Youtube', {
  console: Log.resolve(env.KES_CONSOLE_LEVEL, env.NODE_ENV === 'development' ? 5 : 4),
  file: Log.resolve(env.KES_LOG_LEVEL, env.NODE_ENV === 'development' ? 0 : 3),
}).setDefaultInstance().logger.scope(`Youtube`)


const Database = require('./lib/Database')
const IPC = require('./lib/IPCBridge')
const {
  YOUTUBE_CMD_STOP,
  YOUTUBE_CMD_UPDATE,
} = require('../shared/actionTypes')

let YoutubeProcessor, Prefs
let _Processor

Database.open({  file: path.join(env.KES_PATH_DATA, 'database.sqlite3'),
ro: true,}).then(db => {
  Prefs = require('./Prefs')
  YoutubeProcessor = require('./Youtube/YoutubeProcessor')

  IPC.use({
    [YOUTUBE_CMD_STOP]: async () => {
      log.info('Stopping YouTube processor gracefully')
      cancelProcessing()
    },
    [YOUTUBE_CMD_UPDATE]: async () => {
      log.info('Updating YouTube processor')
      update()
    }
  })

  startProcessing()
})

async function startProcessing () {
  log.info('Starting YouTube processor')

  const prefs = await Prefs.get()
  _Processor = new YoutubeProcessor(prefs)
  await _Processor.process()

  process.exit()
}

async function update () {
  log.info('Updating YouTube processor')

  if (_Processor) {
    const prefs = await Prefs.get()
    _Processor.setPrefs(prefs)
  } else {
    startProcessing()
  }
}

function cancelProcessing () {
  if (_Processor) {
    _Processor.cancel()
  }
}
