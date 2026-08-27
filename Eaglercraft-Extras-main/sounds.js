/*
sounds.js
(c) 2025: x8r and the eaglercraft extras team
licensed under gnu gpl v3

https://www.gnu.org/licenses/gpl-3.0.en.html
https://github.com/x8rr/
https://github.com/eaglercraftextras/
*/

const buttons = document.querySelectorAll("a");
const clients = document.querySelectorAll("li")
var hoverSound = new Audio("/assets/hover.ogg");
var clickSound = new Audio("/assets/click.ogg");

buttons.forEach((button) => {
  button.addEventListener("mouseenter", () => {
    const sound = hoverSound.cloneNode(true);
      sound.play();
      console.debug("played")
  });
});


buttons.forEach(function (button) {
  button.addEventListener("click", (e) => {
    e.preventDefault();
    clickSound.play();
    console.log(e.target.href);
    setTimeout(() => {
      window.location.href = button.href
    }, 150);
  });
});

if (window.location.href.includes("1.")) {
    document.getElementById("clients").addEventListener("mouseover", (e) => {
      const li = e.target.closest("li");
      if (li) {
        const sound = hoverSound.cloneNode(true);
        sound.play();
        console.debug("li hover sound");
      }
    });
    document.getElementById("clients").addEventListener("click", (e) => {
      const li = e.target.closest("li");
      if (li) {
        e.preventDefault();
        clickSound.play();

        const link = li.querySelector("a");
        if (link) {
          console.log(link.href);
          setTimeout(() => {
            window.location.href = link.href;
          }, 150);
        }
      }
    });

}

if (window.location.href.includes("1.")) {
    document.getElementById("clients").addEventListener("mouseover", (e) => {
      const li = e.target.closest("li");
      if (li) {
        const sound = hoverSound.cloneNode(true);
        sound.play();
        console.debug("li hover sound");
      }
    });
    document.getElementById("clients").addEventListener("click", (e) => {
      const li = e.target.closest("li");
      if (li) {
        e.preventDefault();
        clickSound.play();

        const link = li.querySelector("a");
        if (link) {
          console.log(link.href);
          setTimeout(() => {
            window.location.href = link.href;
          }, 150);
        }
      }
    });

}

if (window.location.href.includes("packs")) {
  document.getElementById("clients").addEventListener("mouseover", (e) => {
    const li = e.target.closest("li");
    if (li) {
      const sound = hoverSound.cloneNode(true);
      sound.play();
      console.debug("li hover sound");
    }
  });
  document.getElementById("clients").addEventListener("click", (e) => {
    const li = e.target.closest("li");
    if (li) {
      e.preventDefault();
      clickSound.play();

      const link = li.querySelector("a");
      if (link) {
        console.log(link.href);
        setTimeout(() => {
          window.location.href = link.href;
        }, 150);
      }
    }
  });
}

if (window.location.href.includes("servers")) {
  document.getElementById("cclients").addEventListener("mouseover", (e) => {
    const li = e.target.closest("li");
    if (li) {
      const sound = hoverSound.cloneNode(true);
      sound.play();
      console.debug("li hover sound");
    }
  });
  document.getElementById("cclients").addEventListener("click", (e) => {
    const li = e.target.closest("li");
    if (li) {
      e.preventDefault();
      clickSound.play();

      const link = li.querySelector("a");
      if (link) {
        console.log(link.href);
        setTimeout(() => {
          window.location.href = link.href;
        }, 150);
      }
    }
  });
}

if (window.location.href.includes("worlds")) {
  document.getElementById("cclients").addEventListener("mouseover", (e) => {
    const li = e.target.closest("li");
    if (li) {
      const sound = hoverSound.cloneNode(true);
      sound.play();
      console.debug("li hover sound");
    }
  });
  document.getElementById("cclients").addEventListener("click", (e) => {
    const li = e.target.closest("li");
    if (li) {
      e.preventDefault();
      clickSound.play();

      const link = li.querySelector("a");
      if (link) {
        console.log(link.href);
        setTimeout(() => {
          window.location.href = link.href;
        }, 150);
      }
    }
  });
}

const bgMusic = new Audio("/assets/menu2.ogg")
bgMusic.loop = true
bgMusic.play()