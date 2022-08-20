import BLOCKS from "./blocks.js"

//DOM
const playground = document.querySelector(".playground > ul");
const gameText = document.querySelector(".game-text");
const scoreDisplay = document.querySelector(".score");
const restartButton = document.querySelector(".game-text > button")
//세팅
const GAME_ROWS = 20;
const GAME_COLS = 10;

//변수


let score = 0;
let downSpeed = 500;
let downInterval;
let tempMovingItem;
const MovingItem = {
    type: "spearHead",
    direction: 0,
    top: 0,
    left: 0
};

init()

//함수
function init() {
   
    tempMovingItem = {...MovingItem};
    for(let i = 0; i < GAME_ROWS; i++) {
        prependNewLine()
} 
newScore()
newBlock()
}



function prependNewLine(){
 const li = document.createElement("li");
    const ul = document.createElement("ul");
    for (let j=0; j<GAME_COLS; j++){
        const matrix = document.createElement("li");
        ul.prepend(matrix);
    }
    li.prepend(ul)
    playground.prepend(li)
}

function renderBlocks(moveType = ""){
    console.log(moveType)
    const { type, direction, top, left } = tempMovingItem;
    const movingBlocks = document.querySelectorAll(".moving")
    movingBlocks.forEach(moving => {
        moving.classList.remove(type, "moving");
        
    })
BLOCKS[type][direction].some(block => {
      const x = block[0] + left;
      const y = block[1] + top;
      const target = playground.childNodes[y] ? playground.childNodes[y].childNodes[0].childNodes[x] : null ;
      const isAvailable = checkEmpty(target);
      if (isAvailable){
         target.classList.add(type, "moving")
      } else {
        tempMovingItem = {...MovingItem}
        if(moveType === 'retry'){
            clearInterval(downInterval)
            showGameoverText()
        }
        setTimeout(() => {
            renderBlocks('retry')
            if(moveType === "top"){
                holdBlock();
            }
           
        }, 0)
      
        return true;
      }
   
})

MovingItem.left = left;
MovingItem.top = top;
MovingItem.direction = direction;
}
function holdBlock(){
    const movingBlocks = document.querySelectorAll(".moving")
    movingBlocks.forEach(moving => {
        moving.classList.remove("moving");
        moving.classList.add("hold");
    })
    checkMatch()
}

function checkMatch(){
    const childNodes = playground.childNodes;
    childNodes.forEach(child=>{
        let matched = true;
        child.children[0].childNodes.forEach(li=>{
            if(!li.classList.contains("hold")){
                     matched = false;
            }
        })
        if(matched){
            child.remove();
            prependNewLine()
            score = score + 100 ;
            scoreDisplay.innerText = score;
            switch(score)
            {
                case 1000:
                    downSpeed = downSpeed - 100;
                    break;
                case 2000:
                    downSpeed = downSpeed - 100;  
                    break;
                    case 3000:
                    downSpeed = downSpeed - 100;  
                    break;
                    case 4000:
                    downSpeed = downSpeed - 100;  
                    break;
                 default:
                 break;
            }
        }
    })


    newBlock()
}


function newBlock(){
    console.log(MovingItem)
    clearInterval(downInterval);
    downInterval = setInterval(()=>{
          moveBlock('top',1)
    },downSpeed)
    const blockArray = Object.entries(BLOCKS);
    const randomIndex = Math.floor(Math.random() * blockArray.length)
    
     MovingItem.type = blockArray[randomIndex][0]
     MovingItem.top = 0 ;
     MovingItem.left = 3;
     MovingItem.top = 0 ;
     tempMovingItem = {...MovingItem};
     
     renderBlocks()

}
function checkEmpty(target){
 if(!target || target.classList.contains("hold")) {
      return false;
 }
 return true;
}
function moveBlock(moveType,amount){
   tempMovingItem[moveType] += amount;
   renderBlocks(moveType)

}

function changeDirection(){
    const direction = tempMovingItem.direction;
    direction === 3 ? tempMovingItem.direction = 0 : tempMovingItem.direction +=1;
    renderBlocks()
}

function dropBlock(){
    clearInterval(downInterval);
    downInterval = setInterval(()=>{
           moveBlock("top",1)
    },5)
}

function showGameoverText() {
   gameText.style.display = "flex"
}

function newScore() {
    score = 0;
    scoreDisplay.innerText = score;
    

}
//이벤트 핸들러

document.addEventListener("keydown", e=> {
    switch(e.keyCode){
        case 39:
            moveBlock("left",1);
                break;
        case 37:
            moveBlock("left",-1);
                break;  
        case 40:
            moveBlock("top",1);
                break; 
        case 38:
            changeDirection()
                break; 
        case 32:
            dropBlock()
                break;                                       
        default:
                break;        
                
    }
    
})


restartButton.addEventListener("click",()=>{
   playground.innerHTML = "";
   gameText.style.display = "none";
   init()
})
