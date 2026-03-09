const sidebar = document.getElementById("rightSidebar")
const btn = document.getElementById("toggleRight")

btn.onclick = () => {

sidebar.classList.toggle("collapsed")

if(sidebar.classList.contains("collapsed")){
btn.textContent="◀"
}else{
btn.textContent="▶"
}

}