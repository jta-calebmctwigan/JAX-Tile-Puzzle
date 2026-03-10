const board = document.getElementById('board');
const tray = document.getElementById('tile-tray');
const winBanner = document.getElementById('win-banner');
const replayContainer = document.getElementById('replay-container');

let tiles=[];
let draggedTile=null;
let gameOver=false;
const total=9;

/* CREATE TILES */

function createTiles(){
  tiles=[];
  for(let i=1;i<=total;i++){
    const tile=document.createElement('div');
    tile.classList.add('tile');
    tile.setAttribute('draggable','true');
    tile.dataset.id=i-1;

    const img=document.createElement('img');
    img.src=`media/map_puzzle_${i.toString().padStart(2,'0')}.png`;

    tile.appendChild(img);
    tiles.push(tile);
  }
}

/* SHUFFLE */

function shuffle(arr){
  let m=arr.length,t,i;
  while(m){
    i=Math.floor(Math.random()*m--);
    t=arr[m];
    arr[m]=arr[i];
    arr[i]=t;
  }
  return arr;
}

/* INIT */

function initGame(){
  gameOver=false;
  board.classList.remove('completed');
  winBanner.style.display='none';
  tray.style.display='flex';
  replayContainer.innerHTML='';

  document.querySelectorAll('.cell').forEach(c=>c.innerHTML='');
  tray.innerHTML='';

  createTiles();
  shuffle(tiles);
  tiles.forEach(t=>tray.appendChild(t));
  sizeTrayTiles();
}

/* SIZE TRAY TILES */

function sizeTrayTiles(){
  const w=tray.clientWidth;
  const gap=8*(total-1);
  const tileSize=(w-gap-24)/total;

  tray.querySelectorAll('.tile').forEach(t=>{
    if(!t.classList.contains('placed')){
      t.style.width=tileSize+'px';
      t.style.height=tileSize+'px';
    }
  });
}

/* DRAG */

document.addEventListener('dragstart',e=>{
  if(gameOver) return;
  if(e.target.classList.contains('tile')){
    draggedTile=e.target;
    draggedTile.classList.add('dragging');
  }
});

document.addEventListener('dragend',e=>{
  if(e.target.classList.contains('tile')){
    e.target.classList.remove('dragging');
    draggedTile=null;
  }
});

document.addEventListener('dragover',e=>e.preventDefault());

document.addEventListener('drop',e=>{
  e.preventDefault();
  if(!draggedTile || gameOver) return;

  const cell=e.target.closest('.cell');
  const origin=draggedTile.parentElement;

  if(cell){
    const existing=cell.firstChild;

    if(existing && existing!==draggedTile){
      if(origin.classList.contains('cell')){
        origin.appendChild(existing);
        cell.appendChild(draggedTile);
      }else{
        existing.classList.remove('placed');
        tray.appendChild(existing);
        sizeTrayTiles();
        cell.appendChild(draggedTile);
      }
    }else{
      cell.appendChild(draggedTile);
    }

    draggedTile.classList.add('placed');
    draggedTile.style.width='';
    draggedTile.style.height='';
    checkWin();
  } else {
    draggedTile.classList.remove('placed');
    tray.appendChild(draggedTile);
    sizeTrayTiles();
  }
});

/* WIN CHECK */

function checkWin(){
  let correct=0;
  board.querySelectorAll('.cell').forEach((c,i)=>{
    if(c.firstChild && parseInt(c.firstChild.dataset.id)===i) correct++;
  });

  if(correct===total){
    gameOver=true;
    board.classList.add('completed');
    tray.style.display='none';
    winBanner.style.display='block';
    showReplay();
  }
}

/* REPLAY */

function showReplay(){
  const btn=document.createElement('button');
  btn.textContent='Replay';
  btn.onclick=initGame;
  replayContainer.innerHTML='';
  replayContainer.appendChild(btn);
}

window.addEventListener('resize',sizeTrayTiles);

initGame();