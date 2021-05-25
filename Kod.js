

var telegramUrl = "https://api.telegram.org/bot" + token;
let adminId = "13245678"


/**
 * TODO
 * 
 * - repetition, få misslyckade ord var 5? dag
 * - ta bort custom keyboard efter dagens ord,
 * - sätt att skicka meddelanden utan notiser
 * - hämta, ordtyp (verb, subs) från synonymer.se, använd rätt ordtyp som svarsalternativ
 * 
 * 
 */







let exampleMessage = 'asad Dagens ord är: "nischad" asdas'

let exampleData = {postData: {contents: JSON.stringify({callback_query: {from: {id: adminId},data: "specialiserad", message:{text: exampleMessage}},message: {text: exampleMessage, chat: {id: adminId}}})}}

function exampleFunction(){      


}


function doPost(e = undefined){
  if(e == undefined) { e = exampleData }
  let data = parseUpdate(e)
  let text = data.text //små bokstäver
  let id = data.id
  let name = data.name
  let caseSensitive = data.caseSensitive

  if(id) incTotalMessages(id)

  if(m.text.includes("Dagens ord är:")){  //frågan
    removeMessageInline(id, m.message_id)
    let word = m.text //frågan
    word = word.slice(word.indexOf('"')+1)
    word = word.slice(0, word.indexOf('"'))
    let wordData = getHistoryByWord(word)

    let messageText = callback.data.toLowerCase()
    if(messageText == wordData.desc.toLowerCase()) {
      sendQuiz(id, '✅  Du svarade "'+ callback.data +'".  Det är rätt svar!', ["Starta ett Quiz", "Stäng"])    
      sendWordToUser(id, wordData)
      incCorrectAnswerCount(id)
      return htmlOK()
    }
    else{
      sendQuiz(id, '❌  Du svarade "'+ callback.data +'".  Rätt svar är "'+ wordData.desc +'"', ["Starta ett Quiz", "Stäng"])
      sendWordToUser(id, wordData)
      return htmlOK()
    }
  }
  


  //if(id != adminId) { sendMessage(id, "Nere för underhåll, försök igen senare"); return quit(id)}

  
  if(hasActiveQuiz(id)) { parseQuizInput(id, text); return htmlOK()}
  
  switch(text){
    case "debug": 
      if(id == adminId) sendMessage(adminId, SpreadsheetApp.openById(ordlistaId).getUrl())
      return quit(id)
    case "code": 
      if(id == adminId) sendMessage(adminId, "https://script.google.com/u/0/home/projects/abcdefg123456/edit")
      return quit(id)
      
    case "gå med": 
    case "sub":
      newUser(id); 
      sendMessage(id, "Du har registrerat dig. Du kommer nu få ett nytt ord varje dag."); 
      let q = generateQuizData()
      sendInline(id, 'Dagens ord är:\n "' + q.word + '"\nAnge en synonym', q.options)
      placeInQueue(id, q)
      return quit(id)
      
    case "avregistrera": 
    case "unsub":
      removeUser(id); 
      sendMessage(id, "Du har avregistrerat dig. Du kommer inte längre ta emot några automatiska meddelanden")
      return quit(id)
      
    case "/start": 
      log("startar")
      sendQuiz(id, 'Tryck på "gå med" för att få ett ord från högskoleprovet varje dag', ["Gå med", "Avbryt"])
      return htmlOK()
      
    case "starta ett quiz":
    case "spela igen":
      sendMessage(id, "Quizet startar...")
      startQuiz(id)
      return quit(id)
      
    case "quiz":
      sendQuiz(id, "Vill du starta ett quiz?", ["Starta ett Quiz"])
      return quit(id)

    case "dagens":
      sendMorningMessageTest(id)
    return htmlOK()

    case "avbryt":
    case "sluta spela":
    case "stäng":
      sendMessage(id, 'Du kan skriva "quiz" för att starta ett nytt quiz.')
      return quit(id)
  }

  log("couldn't understand text from U:" + id + " :: " +text)
  sendQuiz(id, "Jag förstår inte..\n\nDu kan välja ett av alternativen nedan.", ["Avregistrera", "Starta ett Quiz", "Stäng"])


  
  return quit(id)
}


function quit(id){
    return htmlOK()
}









