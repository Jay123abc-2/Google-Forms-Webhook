const Webhook = "Webhook link here"
const Colour = "#00bb00"
const Title = "A title here"
const Avatar = 'An avatar link here'
const Mention = "Content / Different role mentions here (<@&RoleId>), say \\@role to get!"
const Description = "A description here?"
const ConvertToLink = true;
const ConvertToMention = true;


const Form = FormApp.getActiveForm(), Responses = Form.getResponses(), LastResponse = Responses[Responses.length - 1]
let Response;
var ItemsTable = [];

try {
  Response = LastResponse.getItemResponses()
} catch (Error) {
  throw "No Responses found in your form."
}
var Items = []
for (var i = 0; i < Response.length; i++) {

  var CharacterLength = 0
  var Question = Response[i].getItem().getTitle(), Answer = Response[i].getResponse();
  if (Answer == "") {
    Answer = "N/A"
  };
  if (Answer.toString().length < 1000) {
    Items.push({"name": Question, "value": Answer});
    CharacterLength += Answer.toString().length;
  } else {
    var Counter = 0;
    Answer = Answer.toString();
    while (Answer.length > 0) {
      var Item = Answer.substring(0, 1000);
      Answer = Answer.substring(1000);
      Counter++;
      Items.push({"name": `${Question} | ${Counter}`, "value": Item})
      CharacterLength += Item.length;

      if (CharacterLength > 4000) {
        ItemsTable.push(Items);
        Items = [];
        CharacterLength = 0;
        
      }

      if (Items.length > 20) {
        ItemsTable.push(Items);
        Items = [];
        CharacterLength = 0;
      }
    }
  }

  if (CharacterLength > 4000) {
      ItemsTable.push(Items);
      Items = [];
      CharacterLength = 0;
    }

    if (Items.length > 20) {
      ItemsTable.push(Items);
      Items = [];
      CharacterLength = 0;
    }
    console.log(Items.length)
  }
  

  function data(item) {
        const linkValidate = /(?:(?:https?|http?):\/\/)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/i;

        if (ConvertToMention && !isNaN(item.value) && item.value.length == 18) item.value = `<@!${item.value}> (${item.value})`;


        if (linkValidate.test(item.value) && ConvertToLink) item.value = `[${item.value}](${item.value})`;

        return [`**${item.name}**`, `${item.value}`].join("\n");
    
}
ItemsTable.push(Items)

function onResponse() {
  for (var i = 0; i < ItemsTable.length; i++) {
    var NewContents = ""
    if (i == 0) {
      NewContents = `${Mention} ${i+1} / ${ItemsTable.length}`;
    } else {
      NewContents = `Continued: ${i+1} / ${ItemsTable.length}`
    }
    var Items = ItemsTable[i]
    const postData = {
          "method": "post",
          "headers": { "Content-Type": "application/json" },
          "muteHttpExceptions": true,
          "payload": JSON.stringify({
              "content": NewContents,
              "embeds": [{
                  "title": Title ? Title : form.getTitle(), // Either the set title or the forms title.
                  "description": Description ? Description: "Response Submitted", // Either the desc or just the res.
                  "fields" : Items,
                  "thumbnail": { url: Avatar ? encodeURI(Avatar) : null }, // The tiny image in the right of the embed
                  "color": Colour ? parseInt(Colour.substr(1), 16) : Math.floor(Math.random() * 16777215), // Either the set colour or random.
                  "timestamp": new Date().toISOString() // Today's date.
              }]
          }),
      };
      UrlFetchApp.fetch(Webhook, postData);
  }
}
