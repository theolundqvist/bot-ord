function gatherSynResult(word){
  word = word.replace(/ /g, '-')
  var html = UrlFetchApp.fetch (synonymUrl + word).getContentText();
  
  var responseValue = {syn:"", sentences:"", synArr:[], def: ""}
  print(word)
  //synonyms
  var path = ["DictResult", "body", '<li value="1">']
  var end = "</ul>"
  var text = gatherTextFromHtmlPath(html, path, end)
  print(text)
  if(text){
    text = text.replace(/;/gi, ',')
    text = removeExtraSpaces(text)
    if(text.indexOf("Användarnas bidrag") > 35){
      text = text.slice(0, text.indexOf("Användarnas bidrag"))
    }
    text = text.replace("Användarnas bidrag", ",")
    text = takeFirstNSentences(text, 10, [','])
    text = text.replace("motsatsord", "\n\nMOTSATSORD:")
    responseValue.synArr = text.split(',')
    responseValue.syn = "SYNONYMER: " + text
  }
  print(responseValue.syn)
  //sentences
  var path = ["DictResult", '<ul id="sentences-list">']
  var end = "</ol>"
  text = gatherTextFromHtmlPath(html, path, end)
  if(text){
    var sentences = text.split(/\r?\n/)
    var response = "EXEMPEL: "
    var sCount = 0
    for(s in sentences) {
      if(sentences[s].length > 10 && sCount < 3){ 
        response += "\r\n" + sentences[s]; 
        sCount++
      }
    }
    let nbrOfSentences = 2
      if(takeFirstNSentences(response, 2, '.').length > 120) nbrOfSentences = 1
    
    responseValue.sentences = takeFirstNSentences(response, nbrOfSentences, ['.', '?', '!']) + "."
  }
  print(responseValue.sentences)

  //definition
  var path = ['<ol start="1">', '<li>']
  var end = "</li>"
  text = gatherTextFromHtmlPath(html, path, end)

  if(text) {
    text = text.replace(/;/g, ",").replace(/:/g, ",")
    responseValue.def = "DEF: " + text
  }          
  print(responseValue.def)

  return responseValue
}

function gatherTextFromHtmlPath(html, path, end){
  var text = html
  for(p in path) { 
    text = text.slice(text.search(path[p]), text.length-1)
  }
  text = text.slice(0, text.search(end))
  return htmlToText(text)
}


function gatherWikiResult(word){

  var json = UrlFetchApp.fetch(wikiAPI + word + "&format=json")
  var data = JSON.parse(json)
  
  var pages = data.query.pages
  
  var pageId = ""
  for(i in pages) {pageId = i; break;}
  
  if(pageId == -1 || pages[pageId].extract.includes("may refer to:") || pages[pageId] == "") return
  
  let result = htmlToText(pages[pageId].extract)
  if(!result) return ""
  let nbrOfSentences = 2
    if(takeFirstNSentences(result, 2).length > 150) nbrOfSentences = 1
  
  return "WIKI:  " + takeFirstNSentences(result, nbrOfSentences)
}


function takeFirstNSentences(text, n, splitter = ['.', '?', '!']){
  var t = text
  for(x of splitter){
    t = t.split(x).slice(0, n).toString()
  }
  return t
}






function htmlToText(text){
  return removeExtraSpaces(removeBetween(text, "<", ">").replace(/[\r\n]+/gm, ''))
}

function removeBetween(text, start, end){
  var count = 0
  while(count < 250)
  {
    var s = text.search(start)
    var e = text.search(end)
    if(e == -1 || s == -1) return text
    var temp = ""
    if(s != 0) temp = text.slice(0, s) 
    text = temp + text.slice(e+1, text.length)
    //log(text)
    count++
  }
  return text
}





//dec
function getWord(text){
  var word = ""
  for(i = 1; i < text.length; i++){
    
    if(text[i] == '*') return word
    else word += text[i]
  }
}


function translate(text){
  var eng = LanguageApp.translate(text, 'sv', 'en')
  return eng
}


function removeExtraSpaces(text){
  for(i in text){
    if(text[i] != ' '){
      return text.slice(i).replace(/  +/g, ' ')
    }
  }
}








