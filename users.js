

function newUser(id=123) {
   if(getUsers().find(x => x == id) == undefined) sheet("users").insertRowBefore(2).getRange(2, 1, 1, 6).setValues([[id, "0", "0", "", "", formattedDate()]]);
}

function userExists(id){
  return getUserIndex(id) != -1
}

function getUsers(){
   let users = sheet("users").getRange(2, 1, sheet("users").getMaxRows(), 1).getValues().filter(x => x != "")
   return users
}

async function updateName(id=adminId, name="TL"){
  let range = sheet("users").getRange(getUserIndex(id), 8, 1, 1).getCell(1,1);
  var values = range.getValues()
  if(values[0][0] == ""){
    values[0][0] = name
    range.setValues(values)
  }
}

function removeUser(id){
  let users = sheet("users").getRange(2, 1, sheet("users").getMaxRows(), 1).getValues();
  var data = []
  users.forEach(u => { if(u != id) data.push(u) })
  sheet("users").getRange(2, 1, data.length, 1).setValues(data)
}

function getUserIndex(id){
  let users = sheet("users").getRange(2, 1, sheet("users").getMaxRows(), 1).getValues();
  for(i = 0; i < users.length; i++){
    if(users[i][0] == id) return i+2
  }
  return -1
}


//MESSAGE COUNT
async function incCorrectAnswerCount(id=adminId){
  let range = sheet("users").getRange(getUserIndex(id), 2, 1, 1).getCell(1,1);
  var values = range.getValues()
  values[0][0]++
  range.setValues(values)
}

async function incTotalMessages(id=adminId){
  let range = sheet("users").getRange(getUserIndex(id), 3, 1, 2);
  var values = range.getValues()
  values[0][0]++
  values[0][1] = getTime()
  range.setValues(values)
}



//QUIZ
function writeQuizData(id=adminId, quizObject){
  let cell = sheet("users").getRange(getUserIndex(id), 5, 1, 1).getCell(1,1);
  cell.setValue(JSON.stringify(quizObject))
}

function getQuizData(id=adminId){
  let data = sheet("users").getRange(getUserIndex(id), 5, 1, 1).getValues()[0][0]
  if(data == "") return null
  return JSON.parse(data)
}
function removeQuizData(id=adminId){
  let cell = sheet("users").getRange(getUserIndex(id), 5, 1, 1).getCell(1,1);
  cell.setValue("")
}




//WORDHISTORY
function getWordHistoryData(id=adminId){
  let data = sheet("users").getRange(getUserIndex(id), 9, 1, 1).getValues()[0][0]
  return ((data=="") ? null : JSON.parse(data)) || emptyHistoryObject()
}

function writeWordHistoryData(id=adminId, data){
  data = data || emptyHistoryObject()
  let cell = sheet("users").getRange(getUserIndex(id), 9, 1, 1).getCell(1,1);
  cell.setValue(JSON.stringify(data))
}

//ADD
async function addFailure(id=adminId, question){
  let cell = getWordHistoryData(id)
  delete cell.queue
  let word = question.word
  if(cell.failures[0][word] == undefined)
  {
    cell.failures[0][word] = {...question, count: 1}
  }
  else cell.failures[0][word].count++
  writeWordHistoryData(id, cell)
}

async function addCleared(id=adminId, question){
  let cell = getWordHistoryData(id)
  delete cell.queue
  let word = question.word
  if(cell.cleared[0][word] == undefined)
  {
    cell.cleared[0][word] = {...question, count: 1}
  }
  else cell.cleared[0][word].count++
  writeWordHistoryData(id, cell)
}

//QUEUE
function placeInQueue(id=adminId, question){
  let cell = getWordHistoryData(id)
  cell.queue = {word: question.word, desc: question.correctAnswer}
  writeWordHistoryData(id, cell)
}

function queueIsEmpty(id=adminId){
  let cell = getWordHistoryData(id)
  if((cell.queue || 0) == 0) return true
  else return false
}

async function pushFail(id){
  let cell = getWordHistoryData(id)
  addFailure(id, cell.queue)
}
async function pushCleared(id){
  let cell = getWordHistoryData(id)
  addCleared(id, cell.queue)
}

//GET COUNT
function getFailureCount(id=adminId, word){
  let cell = getWordHistoryData(id)
  return (cell.failures[0][word] || {count: 0}).count  
}
function getClearedCount(id=adminId, word){
  let cell = getWordHistoryData(id)
  return (cell.cleared[0][word] || {count: 0}).count  
}

//REMOVE
function removeFailure(id=adminId, word){
  let cell = getWordHistoryData(id)
  delete cell.failures[0][word]
  writeWordHistoryData(id, cell)
}
function removeCleared(id=adminId, word){
  let cell = getWordHistoryData(id)
  delete cell.cleared[0][word]
  writeWordHistoryData(id, cell)
}

function emptyHistoryObject(){return {failures: [{}], cleared:[{}]}}






















