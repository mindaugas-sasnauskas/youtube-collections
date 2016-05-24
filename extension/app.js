// Copyright (c) 2010 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

//////////////// cust
// var ws = new WebSocket("ws://localhost:3007/vidl");
//
// ws.onopen = function () {
//   console.log("Socket has been opened!");
// };
//
// ws.onmessage = function (message) {
//   listener(JSON.parse(message.data));
//   // Service.getVideos
// };
// ws.onclose = function () {}

// function vidToDownload(url) {
//   console.log(url + "from function");
//   var message = {
//     type: "download",
//     url: url
//   }
//   // setTimeout(function () {
//   //   ws.send(JSON.stringify(message));
//   // }, 1)
// }

chrome.browserAction.onClicked.addListener(callback)
function callback(e){
   vidToDownload(e.url)
}
function postlink(url){
  var message = {
      type: "autogen-list",
      url: url
    }
  $.post('http://localhost:5000/api/autogen-list', message);
}

//////////////////////////
//////////////// cust END
//////////////////////////

// A generic onclick callback function.
function genericOnClick(info, tab) {
  console.log("item " + info.menuItemId + " was clicked");
  console.log("info: " + JSON.stringify(info));
  console.log("tab: " + JSON.stringify(tab));
  if (info.linkUrl) {
    console.log("link on");
    //vidToDownload(info.linkUrl);
    postlink(info.linkUrl)
  }
}

// Create one test item for each context type.
var contexts = ["page", "selection", "link", "editable", "image", "video",
  "audio"
];
for (var i = 0; i < contexts.length; i++) {
  var context = contexts[i];
  var title = "Test '" + context + "' menu item aa";
  var id = chrome.contextMenus.create({
    "title": title,
    "contexts": [context],
    "onclick": genericOnClick
  });

  console.log("'" + context + "' item:" + id);
}


// Create a parent item and two children.
var parent = chrome.contextMenus.create({
  "title": "Test  parent item"
});
var child1 = chrome.contextMenus.create({
  "title": "Child 1",
  "parentId": parent,
  "onclick": genericOnClick
});
var child2 = chrome.contextMenus.create({
  "title": "Child 2",
  "parentId": parent,
  "onclick": genericOnClick
});
console.log("parent:" + parent + " child1:" + child1 + " child2:" + child2);


// Create some radio items.
function radioOnClick(info, tab) {
  console.log("radio item " + info.menuItemId +
    " was clicked (previous checked state was " +
    info.wasChecked + ")");
}
var radio1 = chrome.contextMenus.create({
  "title": "Radio 1",
  "type": "radio",
  "onclick": radioOnClick
});
var radio2 = chrome.contextMenus.create({
  "title": "Radio 2",
  "type": "radio",
  "onclick": radioOnClick
});
console.log("radio1:" + radio1 + " radio2:" + radio2);


// Create some checkbox items.
function checkboxOnClick(info, tab) {
  console.log(JSON.stringify(info));
  console.log("checkbox item " + info.menuItemId +
    " was clicked, state is now: " + info.checked +
    "(previous state was " + info.wasChecked + ")");

}
var checkbox1 = chrome.contextMenus.create({
  "title": "Checkbox1",
  "type": "checkbox",
  "onclick": checkboxOnClick
});
var checkbox2 = chrome.contextMenus.create({
  "title": "Checkbox2",
  "type": "checkbox",
  "onclick": checkboxOnClick
});
console.log("checkbox1:" + checkbox1 + " checkbox2:" + checkbox2);
