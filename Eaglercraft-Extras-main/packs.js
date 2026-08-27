/*
resource pack loader
yes, this is reused code from loader.js
(c) 2025: x8r and the eaglercraft extras team
licensed under gnu gpl v3

https://www.gnu.org/licenses/gpl-3.0.en.html
https://github.com/x8rr/
https://github.com/eaglercraftextras/
*/

// set up globals
let res;
let data;

// get doms
const clientsList = document.getElementById("clients");

// get json
async function getJSON() {
  res = await fetch(`assets/json/packs.json`);
  data = await res.json();
}

// now load clients and append children
function loadClients(v) {
  getJSON(v)
    .then(() => {
      console.log(`Array: ${data}`);
    })
    .then(() => {
      data.forEach((data) => {
        // create new elements
        const newClient = document.createElement("li");
        const newTitle = document.createElement("h1");
        const newLink = document.createElement("a");
        const newIcon = document.createElement("img");
        const newPlaybtn = document.createElement("img");
        const newAuthor = document.createElement("p");

        // set attributes
        newClient.setAttribute("id", "client");
        newTitle.setAttribute("id", "title");
        newLink.setAttribute("id", "link");
        newIcon.setAttribute("id", "icon");
        newPlaybtn.setAttribute("id", "playbtn");

        // update content
        newTitle.textContent = data.name;
        newAuthor.textContent = `Author: ${data.author}`;
        newLink.href = data.url;
        newIcon.src = data.icon;

        // move elements into list
        clientsList.appendChild(newClient);
        newClient.appendChild(newIcon);
        newClient.appendChild(newTitle);
        newClient.appendChild(newAuthor);
        newIcon.appendChild(newLink);
        newClient.appendChild(newLink);
        newLink.appendChild(newPlaybtn);
      });
    });
}

loadClients()
