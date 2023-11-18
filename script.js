const n = 10;
const array = [];

for(let i = 0; i<n; i++){
    array[i] = Math.random();
}
for(let i = 0; i<array.length ;i++){
    const bar = document.createElement("div");
    bar.style.height = array[i]*100+"%";
    bar.style.width = "10px";
    bar.style.backgroundColor = "black";
    container.appendChild(bar);
}