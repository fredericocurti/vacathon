var express = require('express')
var app = express()
var multer = require('multer')

var fs = require('fs')

const port = 3001

var upload = multer({ dest: __dirname + '/public/uploads/' })
var type = upload.single('upl')

app.post('/api/stt', type, (req, res) => {
  console.log('Received request')

  var SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1')
  var ConversationV1 = require('watson-developer-cloud/conversation/v1');

  var stt = new SpeechToTextV1 ({
    username: '42092470-28bd-4834-a53c-7a503f4a7c51',
    password: 'Wh8WLmiTWNVL'
  })

  var conversation = new ConversationV1({
    username: '7136577e-1523-43f8-98b1-f8bf98eb02aa',
    password: 'fKOSrIX2Uf5E',
    version_date: ConversationV1.VERSION_DATE_2017_05_26
  })

  let audio = fs.createReadStream(req.file.path)

  var params = {
    audio: audio,
    content_type: 'audio/webm;codecs=opus',
    timestamps: true,
    model: 'pt-BR_BroadbandModel'
  }

  stt.recognize(params, (error, transcript) => {
    if (error) {
      console.log('Error:', error)
      res.json({ status: 'err' })
    } else {
      let result = JSON.stringify(transcript, null, 2)
      console.log(result)
      conversation.message({
        input: { text: transcript.results[0].alternatives[0].transcript },
        workspace_id: '433116b3-78ab-4923-8031-b64821d7ca6f'
      }, (err, response) => {
        if (err) {
          console.error(err)
        } else {
          console.log(JSON.stringify(response, null, 2))
        }

      })
      res.json({status : 200})
    }
  })
})

app.listen(port)
console.log('LISTENING ON PORT',port)
