const vid = document.getElementById("introVid");
const p = document.getElementById("opening")
console.debug(vid)
p.style.display = "block";
const menuMusic = new Audio("/assets/menu2.ogg")

const seen = sessionStorage.getItem("seenVid")

if (seen !== "true") {
    document.addEventListener("click", () => {
      vid.play();
      p.style.display = "none";
    });

    vid.addEventListener("ended", () => {
      vid.style.opacity = "0";
      console.log("opacity set");
      setTimeout(() => {
          vid.style.display = "none";
          sessionStorage.setItem("seenVid", "true")
      }, 300); // small delay so opacity fade is visible
    });
} else {
  vid.style.display = "none"
  p.style.display = "none"
}