/**
 * Skickar ett meddelande med svarsalternativ under
 * @param {string=} id - User id
 * @param {string=} text - Message text
 * @param {array=} buttons - Button text or {text: "", url?: "", insert_in_chat?: ""}, array is rows and cols [[],[]], max one optional
 */
function sendMessage(id=adminId, text="fråga", buttons = [[]]){
  var url = botUrl + "/sendMessage?";
  
  fetch(url,{"chat_id":id, "text": text, "parse_mode":"HTML", "reply_markup": parseInlineKeyboard(buttons)})
}

/**
 * Skickar ett photo med text
 * @param {string=} id - User id
 * @param {any=} img - url or file
 * @param {string=} text - image caption
 * @param {array=} buttons - Button text or {text: "", url?: "", insert_in_chat?: ""}, array is rows and cols, max one optional
 */
function sendPhoto(id=adminId, img, text, buttons){
  var url = botUrl + "/sendPhoto?"
  fetch(url, {chat_id:id, caption:text, photo: img, parse_mode:"HTML",reply_markup: parseInlineKeyboard(buttons)})
}


/**
 * Skickar ett meddelande med svarsalternativ istället för tangentbord
 * @param {string=} id - User id
 * @param {string=} text - Message text
 * @param {array=} buttons - Button text or {text: "", url?: "", insert_in_chat?: ""}, array is rows and cols, max one optional
 */
function sendMultipleChoice(id=adminId, text="fråga", buttons){
  var url = botUrl + "/sendMessage?";
  var keys = buttons.map(x => [{"text": x}])
  
  var keyboard = {
    "keyboard": keys,
    "one_time_keyboard": true,
    "resize_keyboard" : true
  };
  
  fetch(url,{"chat_id":id, "text": text, "parse_mode": "HTML", "reply_markup": parseInlineKeyboard(keyboard)})
}


/**
 * 
 */
function parseInlineKeyboard(buttons){
  //parse keys
  for(i in buttons){
    for(j in buttons[i]){
      let x = buttons[i][j]
      if(typeof x === 'string') buttons[i][j] = {text: x, callback_data: x}
      else if(typeof x.insert_in_chat === 'string'){
        buttons[i][j].switch_inline_query_current_chat = buttons[i][j].insert_in_chat
        delete buttons[i][j].insert_in_chat
        delete buttons[i][j].url
      }
    }
  }
  if(buttons){
    return {
      "inline_keyboard": buttons
    };
  }
  else return

}

/**
 * Tar bort svarsalterativ från ett meddelande
 * @param {string=} id - User id
 * @param {string=} messageId - Message id
 */
function removeMessageInline(id=adminId, messageId){
  var url = botUrl + "/editMessageReplyMarkup?";
    var keyboard = {
    "inline_keyboard": []
  };
  fetch(url, {"chat_id": id, "message_id": messageId, "reply_markup": JSON.stringify(keyboard)})
}











/**
 * Skickar sökresultat till användaren baserat på {query}
 * @param {string=} queryId
 * @param {string=} query
 */
function displaySearchResults(queryId, query=""){
  list = searchStocks(query)

  if(!list || list.length == 0) list = getAllUsersWithStockFollowInfo().filter(u => u.id == adminId)[0].follows.map(f => Object({name: f}))

  for(i in list){
    list[i] = {
    type: "article", 
    id: i, 
    title: list[i].name, 
    input_message_content: {message_text: list[i].name}
    }
  }
  url = botUrl + "/answerInlineQuery?"

  fetch(url,{"inline_query_id":queryId, "results": JSON.stringify(list)})
}

/**
 * Tolkar indata från användare
 */
function parseUpdate(e = exampleData){
  var res = {}
  
  let update = JSON.parse(e.postData.contents)

  let callback = update.callback_query
  if(callback){
    res.m = callback.message
    res.id = callback.from.id
    res.text = res.m.text = callback.data.toLowerCase()
    res.caseSensitive = callback.data
    res.name = callback.from.first_name + " " + callback.from.last_name
    res.message_id = callback.message.message_id
  }
  else if(update.inline_query){
    res.query = update.inline_query.query
    res.id = update.inline_query.from.id
    res.name = update.inline_query.from.first_name + update.inline_query.from.last_name
    res.query_id = update.inline_query.id
    
  }
  else {
    res.m = update.message
    res.id = res.m.chat.id
    res.text = res.m.text.toLowerCase()
    res.caseSensitive = res.m.text
  }
  return res
}





function setWebHook(){
  var url = "https://script.google.com/macros/s/abcdefg123456/exec"
  var res = UrlFetchApp.fetch(botUrl+"/setWebhook?url="+url+"&allowed_updates=message").getContentText();
  Logger.log(res)
}

function webhookinfo(){
  var res = UrlFetchApp.fetch(botUrl+"/getWebhookInfo").getContentText();
  Logger.log(res)
}
