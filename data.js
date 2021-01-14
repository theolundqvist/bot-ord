var wikiUrl = "https://duckduckgo.com/?q=!w+"
var wikiAPI = "https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=&titles=" //+word+"&format=json"
var synonymUrl = "https://www.synonymer.se/sv-syn/"



/**
 * @returns {SpreadsheetApp.Sheet}
 */
function sheet(sheetName){
  return SpreadsheetApp.openById(ordlistaId).getSheetByName(sheetName)
}








function randomWord(){
  let s = sheet("HP")
  
  let values = s.getRange(2,1, s.getMaxRows(), 2).getValues()
  let index = nextInt(0, values.length)
  return {word: values[index][0], desc: values[index][1], index: index+1}
}








function updateWordIndex(){
  let s = sheet("HP")
  
  let values = s.getRange(1,1, s.getMaxRows(), 2).getValues()
  
  var index = values[0][0]
  var word = ""
  var desc = ""
  var synRes = ""
  
  do{
    index++
      word = values[index][0]
      desc = values[index][1]
      synRes = gatherSynResult(word)
      log("searching for synonyms {"+ word +"}: synlength: " + synRes.synArr.length)
  } while (synRes.synArr.length < 2);
  
  s.getRange(1,1).getCell(1,1).setValue(index)
}

function getTodaysWord(){ 
  
  let w = readWordFromHistory()
  //log(w.date + " == " + formattedDate())
  if(w.date == formattedDate()) return w;
  return generateWord(0) 
}

function generateWord(offset = 0){

  log("generating new data")
  updateWordIndex()
  
  let s = sheet("HP")
  
  let values = s.getRange(1,1, s.getMaxRows(), 2).getValues()
  
  let index = values[0][0]
  
  let word = values[index][0]
  let desc = values[index][1]
  
  let wordEng = translate(word)
  let descEng = translate(desc)
  
  let synRes = gatherSynResult(word)
  let wikiRes = gatherWikiResult(wordEng)
  
  let res = {date: formattedDate(offset), word: word, desc: desc, wordEng: wordEng, descEng: descEng, wiki: wikiRes, sentences: synRes.sentences, syn: synRes.syn, def:synRes.def, index: index+1}
  writeWordToHistory(res)
  return res
}

function getRandomDesc(){
  var s = sheet("HP")
  var values = s.getRange(1, 1, s.getMaxRows(), 2).getValues()
  return Array(5).fill(0).map(x => values[nextInt(1, values.length)][1])
}

function generateQuizData(id=adminId, offset = 0){
  var options = getRandomDesc()
  let t = getTodaysWord(offset);
  let word = t.word;
  let desc = t.desc; 
  options[nextInt(0, 3)] = desc;
  
  return {word: word ,correctAnswer: desc, options: options, cleared: false, answer: undefined, syn: gatherSynResult(word).syn}
}




function exists(word){
  let s = sheet("HP")
  
  let values = s.getRange(1,2, s.getMaxRows(), 2).getValues()
  
  for(i = 0; i < values.length; i++){
    if(word == values[i][0]) return true;
  }
  false
}


function check(){
  let s = sheet("HP")
  
  let values = s.getRange(1,1, s.getMaxRows(), 2).getValues()
  
  var i = 0
  var e = 0
  values.forEach(function(row){
    i++
      let syn = gatherSynResult(row[0]).syn.split(',')
      if(syn.length < 4) {
        log(i + ":" + e + ":  " + syn.length + "  " + syn)
        e++
      }
  })
}



function checkForDuplicates(){
  let ss = sheet("HP")
  var xs = ss.getRange(2, 1, ss.getMaxRows(), 1).getValues().map(x => [x[0], 0])
  for(wordData of xs){
    for(otherWord of xs){
      if(wordData[0] == otherWord[0]) wordData[1]++
    }
  }
  xs = xs.sort((a, b) => b[1] - a[1])
  print(xs.filter(x => x[1] != 1).length)

}








function print(t){
  log(t)
  log(translate(t))
  
  var wordSv = getWord(t)
  var wordEn = translate(wordSv)
  
  log(wikiUrl + wordEn)
  log(synonymUrl + wordSv)
  
}




function log(text){
  var logSheet = sheet("log")
  logSheet.insertRowBefore(1).getRange(1, 1, 1, 2).setValues([[new Date(Date.now()), text]]);
}



