
function htmlOK(){
  return HtmlService.createHtmlOutput('header("HTTP/1.1 200 OK");'); 
}



function getDate(offset = 0){
  let t = new Date()
  t.setDate(t.getDate() + offset);
  return t.getFullYear() + "-" + (t.getMonth() + 1) + "-" + t.getDate()
}

function getTime(){
  let t = new Date()
  let h = ("0"+(t.getUTCHours()+1)%24).slice(-2)
  let m = ("0"+t.getUTCMinutes()).slice(-2)
  let s = ("0"+t.getUTCSeconds()).slice(-2)
  return ([h,m,s].join(":"))
}


function nextInt(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}




var isNumber = function isNumber(value) 
{
   return typeof value === "number" && isFinite(value);
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function print() {
  var text = ""
  for (var i = 0; i < arguments.length-1; i++) {
    text += arguments[i] + ", "
  }
  text += arguments[arguments.length-1]
  Logger.log(text)
}



function fetch(url, data, type){
  switch(type){
    case "html": type = "text/html"; break;
    case "json": type = "application/json"; data = JSON.stringify(data); break;
    case "form": type = "multipart/form-data"; break;
  }
  var options = {
    method: "POST", 
    contentType:type,
    payload: data
  }
  var request = UrlFetchApp.getRequest(url,options);   // (OPTIONAL) generate the request so you
  Logger.log("Request payload: " + request.payload); 
  var response = UrlFetchApp.fetch(url,options);
  Logger.log(response.getContentText());
  return response.getContentText()
}

function log(text){
  var logSheet = sheet("log")
  logSheet.insertRowBefore(1).getRange(1, 1, 1, 2).setValues([[new Date(Date.now()), text]]);
}


timeFunc = (func, query) => {
  let t = new Date().getTime()
  let r = func(query)
  return {t: new Date().getTime()-t, value: r}
}
