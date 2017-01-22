const formApp = document.getElementById("formApp");
const inputFields = formApp.getElementsByTagName("input");
const form = formApp.querySelector("form");
const addItemBtns = formApp.querySelectorAll("button.js-addItem");
const addressNames = [];
var finalData = {};

addItemBtns.forEach((btn) => {
  btn.addEventListener("click", addItem);
});

form.addEventListener("submit", function(event) {
  event.preventDefault();

  genFinalData();

  document.getElementById("print").innerHTML =
  ``;

  printFinalData();
  console.log(finalData);
});

// UI
function addItem() {
  var inputToAdd = event.target.parentNode.getElementsByTagName('span')[0];
  var clnInputToAdd = inputToAdd.cloneNode(true);
  for (var i = 0; i < clnInputToAdd.childNodes.length; i++) {
    clnInputToAdd.childNodes[i].value = "";
  }
  event.target.parentNode.insertBefore(clnInputToAdd, event.target);
  // addEventListener();
}

// data
function inputToObject(element) {
  if (!element.name)
    return;
  let obj = {};
  obj[element.name] = element.value;
  return obj;
}
function isAddress(element) {
  const addressEl = formApp.querySelector(".address");
  if (addressNames.length === 0) {
    addressEl.querySelectorAll("input").forEach((input) => {
      addressNames.push(input.name);
    });
  }
  return addressNames.indexOf(element.name) > -1;
}
function getAddressArr() {
  const addressEls = document.querySelectorAll(".address");
  const addressArr = [];

  addressEls.forEach((addressSpan) => {
    let addressObj = {};
    addressSpan.querySelectorAll("input").forEach((input) => {
      Object.assign(addressObj, inputToObject(input));
    });

    addressArr.push(addressObj);
  });
  return addressArr;
}
function genFinalData() {
  finalData = {};
  for (var i = 0; i < inputFields.length; i++) {
    if (isAddress(inputFields[i]))
      continue;
    if (inputFields[i].type == 'radio' && !inputFields[i].checked)
      continue;

    let name = inputFields[i].name;
    if (!(name in finalData)) {
      finalData[name] = inputFields[i].value;
    } else {
      if (!Array.isArray(finalData[name])) {
        finalData[name] = [finalData[name]];
      }
      finalData[name].push(inputFields[i].value);
    }
  }

  finalData["address"] = getAddressArr();
}

// print data to DOM
function addElement(type) {
  let node = document.createElement(type);
  for (let i = 1; i < arguments.length; i++) {
    let child = arguments[i];
    if (typeof child == "string")
      child = document.createTextNode(child);
    node.append(child);
  }
  return node;
}
function appendChildInId(id, child) {
  return document.getElementById(id).appendChild(child);
}
function addressToListElement(item) {
    let output = [],
        keys = Object.keys(item),
        vals = keys.map((key) => item[key]);

    keys.forEach((key, index) => {
      output.push(addElement("li", key, ": ", vals[index]));
    });
    return addElement("ul", ...output);
}
function printFinalData() {
  for (data in finalData) {
    if (data != "address")
      appendChildInId("print", addElement(
        "p",
        data, ": ", finalData[data]
      ));
    else {
      appendChildInId("print", addElement(
        "p",
        data, ": "
      ));
      finalData[data].forEach((item) => {
        appendChildInId("print", addressToListElement(item));
      });
    }
  }
}

// addEventListener();

// function addEventListener() {
//   for (var i=0; i<inputFields.length; i++) {
//     if (!inputFields[i].eventAdded) {
//       inputFields[i].addEventListener("change", function(event) {
//         console.log(event.target.name + ": " + event.target.value);
//       });
//       inputFields[i].eventAdded = true;
//     }
//   }
// }
