var express = require('express')
var app = express()
var multer = require('multer')
var firebase = require('firebase')

var fs = require('fs')

const port = 3001

var upload = multer({ dest: __dirname + '/public/uploads/' })
var type = upload.single('upl')
// Initialize Firebase
// TODO: Replace with your project's customized code snippet
var config = {
  apiKey: "AIzaSyAUE5v4GX4Ti4QZhNhRLY7rmB7F3co3Ju8",
  authDomain: "vacathon.firebaseapp.com",
  databaseURL: "https://vacathon.firebaseio.com",
  projectId: "vacathon",
  storageBucket: "vacathon.appspot.com",
  messagingSenderId: "525053490596"
}; 

var transacaoObj = (hora, natureza, valor) =>{
  var transacao ={
    hora: hora,
    natureza: natureza,
    valor: valor
  }
  return transacao
}

firebase.initializeApp(config);

// var query =  firebase.database().ref('/custos').once('value').then((snapshot)=>{
//   // console.log(snapshot.val())
//   let result = snapshot.val()
//   let custoTotal = 0;
//   let totalResponse = []
//   for(var i =0; i < Object.keys(result).length; i++){
//     totalResponse.push(Object.values(result)[i])
//     console.log(Object.values(result)[i].valor)
//     custoTotal += parseInt(Object.values(result)[i].valor)
//   } 
// })

async function getCustos() {
  var resJson = {}  
  var custoTotal = 0;
  var totalCustoResponse = []
  var receitaTotal = 0;
  var totalReceitaResponse = []

  var snapshot = await firebase.database().ref('/custos').once('value')

  var result = snapshot.val() 
  
  for(var i =0; i < Object.keys(result).length; i++){
    totalCustoResponse.push(Object.values(result)[i])
    custoTotal += parseInt(Object.values(result)[i].valor)
  }
  resJson["custos"] = totalCustoResponse
  resJson["custoTotal"] = custoTotal

  var snapshot = await firebase.database().ref('/receitas').once('value')
  var result = snapshot.val()

  for(var i =0; i < Object.keys(result).length; i++){
    totalReceitaResponse.push(Object.values(result)[i])
    receitaTotal += parseInt(Object.values(result)[i].valor)
  }
  
  resJson["receitas"] = totalReceitaResponse
  resJson["receitasTotal"] = receitaTotal
  return resJson
}


// let teste, testeUhu = getCustos()

// function writeTransacaoData(custo) {
//   firebase.database().ref('receitas').push(custo);
// }

// var time = new Date().valueOf()
// console.log(time)
// writeTransacaoData(transacaoObj(new Date().valueOf(), "venda feno", "300"))

app.get('/api/finances',(req,res) => {
  getCustos().then((data) => {res.json(data)})
})

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
          res.send(response)          
        }
      })
    }
  })
})

app.listen(port)
console.log('LISTENING ON PORT',port)
