//var ordlistaId = "abcdefg123456"



function writeWordToHistory(data){
  log("writing to history")
   let logSheet = sheet("history")
   logSheet.insertRowBefore(1).getRange(1, 1, 1, 2).setValues([[data.date, JSON.stringify(data)]]);
}

function readWordFromHistory(index=0){
  let logSheet = sheet("history")
  if(index + 1 > logSheet.getMaxRows()) return 
  let d = logSheet.getRange(index + 1, 2, 1, 1).getValues()[0]
  return JSON.parse(d)
}

function getHistoryByWord(str){
  let logSheet = sheet("history")
  let d = logSheet.getRange(1, 2, 100, 1).getValues().filter(x => x[0] != "")
  for(a of d){
    var wordData = JSON.parse(a[0])
    if(wordData.word == str) {return wordData}
  }
}

function removeWord(index = 0){
    let ss = sheet("history")
    ss.deleteRow(index + 1)
}






function generateHistory(n=10){
  
  log("generating history")
  for(var i = 0; i <= n; i++){
    log("generating word: " + formattedDate(n-i))
    generateWord(n-i)
  }
}





function sendWordToUser(id=adminId, wordData = getTodaysWord()){
  try{
    //sendMessage(id, "Här kommer dagens ord. " + formattedDate())
    log("skickade ord till " + id)
    let d = wordData
    let sv = "*" + d.word + "* -- " + d.desc
    let eng = "*" + d.wordEng + "* -- " + d.descEng
    let message = ["(sv)  " +  sv, "(eng) " + eng, d.wiki, d.def, d.syn, d.sentences].join("\n\n")
    sendInline(id, message, ["Starta ett Quiz", "Avregistrera"])
}
catch(err){
  sendMessage(adminId, "ett id kunde inte hittas: " + id + " " + err || "")
  return
}
}




function sendMorningMessage(){
  let users = getUsers()
  //let users = [1430571661]
  let q = generateQuizData()
  for(let id of users){
    sendInline(id.toString(), 'Dagens ord är:\n "' + q.word + '"\nAnge en synonym', q.options);
    removeQuizData(id.toString())
    placeInQueue(id.toString(), q)
  }
}

function sendMorningMessageTest(id = adminId, index = 1){
  let q = generateQuizData(index)
  sendInline(id.toString(), 'Dagens ord är:\n "' + q.word + '"\nAnge en synonym', q.options);
  removeQuizData(id)
  placeInQueue(id, q)
}

function sendMessageToAll(){
  let users = getUsers()
  for(let id of users){
    try{
      sendMessage(id.toString(), "")
    }
    catch(e){ 
      print(id)
      print(e) 
    }
  }
}




function sendPersonalMessage(id=12345678){
  sendMessage(id, "Hej namn, fungerar appen som den ska?\n\nUppge annars vad som är fel")
}

