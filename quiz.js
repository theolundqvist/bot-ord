

function hasActiveQuiz(id=adminId){
  if(!userExists(id)) return false
  let q = getQuizData(id)
  return !(q == null || q.isActive == false)
}

function parseQuizInput(id="", text="3"){
  
  let q = getQuizData(id)
  
  //quit
  if(text == "avbryt" || text =="sluta spela"){
    if(q.nbrOfQuestions == 0) {removeQuizData(id); sendInline(id, "Quizet har avslutats.", ["Starta ett Quiz"])}
    else quitQuiz(id, q)
    return
  }
  //check for number to generate quiz
  if((isNumber(parseInt(text)) && (q.nbrOfQuestions == 0) || q.isActive == false)){
    sendQuiz(id, "slumpar ord...", ["Sluta spela"])
    generateQuestions(id, q, parseInt(text))
    return
  }
  
  
  let correctAnswer = q.questions[q.current].correctAnswer
  let options = q.questions[q.current].options
  
  //correct
  if(text == correctAnswer){
      q.questions[q.current].cleared = true
      q.questions[q.current].answer = text
      sendMessage(id, '✅  Du svarade "'+ text +'".  Det är rätt svar!\n\n' + q.questions[q.current].syn + '\n\n' + q.questions[q.current].def)
      incCorrectAnswerCount(id)
      pushCleared(id)
  }
  //wrong answer
  else if(options.includes(text)){
    q.questions[q.current].answer = text
    sendMessage(id, '❌  Du svarade "'+ text +'".  Rätt svar är "'+ correctAnswer +'"\n\n' + q.questions[q.current].syn + '\n\n' + q.questions[q.current].def)
    pushFail(id)
  }
  else return;
  q.current++
  sendQuestion(id, q)
  incTotalMessages(id)
}

function startQuiz(id=adminId){
  writeQuizData(id, {isActive: true, questions: undefined, nbrOfQuestions: 0, current: 0})
  sendQuiz(id, "Ange antalet frågor", [3, 5, 10]) //slumpat eller repetition
}

function generateQuestions(id=adminId, q, n=10){
  if(q == undefined) q = getQuizData(id)
  var xs = []
  for(idx = 0; idx < n; idx++){
    xs.push(getQuestionData(randomWord()))
  }
  q.questions = shuffle(xs)
  q.nbrOfQuestions = xs.length
  sendQuestion(id, q)
}


function sendQuestion(id=adminId, quizData){
  let q = quizData
  if(q.current >= q.nbrOfQuestions){
    quitQuiz(id, q)
  }
  else{
    let frågaStr = "[Fråga "+ (q.current + 1) +"/"+ q.nbrOfQuestions + "]"
    let current = q.questions[q.current]
    writeQuizData(id, q)
    sendInline(id, frågaStr + '\n\nAnge en synonym till "'+ current.word +'"', current.options)
    placeInQueue(id, current)
  }
}

function getQuestionData(wordData){
  var options = getRandomDesc()
  let word = wordData.word;
  let answer = wordData.desc; 
  options[nextInt(0, 4)] = answer;
  
  let syn = gatherSynResult(word)

  return {word: word, index: wordData.index ,correctAnswer: answer, options: options, cleared: false, answer: undefined, syn: syn.syn, def: syn.def}
}



function quitQuiz(id=adminId, q){
  if(q == undefined) q = getQuizData(id)
  q.isActive = false
  writeQuizData(id, q)
  let score = 0
  q.questions.map(x => {if(x.answer == x.correctAnswer) score++})
  var i = 1
  var symbol = []
  q.questions.map(x => {if(x.cleared) {symbol.push("✅")} else {symbol.push("❌")} })
  let result = q.questions.map(x => "[" + i + "/" + q.questions.length + ']  "' + x.word + '" '+ symbol[i++ - 1] +'\nDitt svar: "' + x.answer + '"\nRätt svar: "' + x.correctAnswer + '"').join("\n\n")
  sendInline(id, "Quizet har avslutats.\n\nDitt resultat:\n" + result + "\n\nAntal rätt: " + score + " av " + q.questions.length , ["Spela igen"])
    
}





