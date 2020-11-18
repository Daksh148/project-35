//Create variables here
var dog,happyDog, database, foodS, foodStock,dogimg,hdogimg, feedButton, addButton,fedTime,lastFed,foodObj;

function preload()
{
  //load images here
  dogimg=loadImage("sprites/Dog.png");
  hdogimg=loadImage("sprites/happydog.png");
  milkimg=loadImage("sprites/Milk.png");
}

function setup() {
  createCanvas(2000, 2000);
  database=firebase.database();
  dog=createSprite(900,280);
  dog.addImage(dogimg);
  dog.scale=0.3;
  
  foodStock=database.ref('food');
  foodStock.on("value",readStock);
 
  foodObj=new Food();
  feedButton=createButton("Feed the Dog");
  feedButton.position(700,95);
  

  addButton=createButton("Add Food");
  addButton.position(800,95);

}


function draw() {  
  background(46,139,87);
 
  drawSprites();
  //add styles here
  textSize(10);
  fill(rgb(0,0,20));
  stroke(1);
  
  
  textSize(50);
  fill("white");
  
  textSize(30);
  text("Food Remaining: "+foodS,110,150);

  foodObj.display();
  fedTime=database.ref('feedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
  fill("white");
  textSize(15);
  if(lastFed>=12){
    text("Last Fed: "+ lastFed%12+"PM",350,30);
  }
  else if(lastFed==0){
    text("Last Fed: 12 AM",350,30);
  }
  else{
    text("Last Fed: "+lastFed+"AM",350,30);
  }
  addButton.mousePressed(function(){
    writeStock(foodS);
  });
  feedButton.mousePressed(function(){
    feedDog(foodS);
  });
  var x=80, y=100;
  if(foodS!=0){
      for(var i=0;i<foodS;i++){
          if(i%10==0){
              x=80;
              y=y+50;
          }
          image(milkimg,x,y,50,50);
          x=x+30;
      }
  }
}

function writeStock(x){
  x=x+1;
  database.ref('/').update({
    food:x
  })
}
function readStock(data){
  foodS=data.val();
}
function feedDog(x){
  dog.addImage(hdogimg);
  if(x<=0){
    x=0
  }
  else{
    x=x-1;
  }
  database.ref('/').update({
    food:x,
    feedTime:hour()
  })
}