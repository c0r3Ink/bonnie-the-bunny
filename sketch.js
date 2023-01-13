//namespacing
const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

var engine;
var world;

var chao;
var corda;
var cueio;
var melon;
var link;
var background;
var melonImg;
var cueioImg;
var botao;
var idle;
var eat;
var sad;
var air, eating, corte, triste, music;
var balao;
var mute;
var corda2;
var link2;
var botao2;

function preload() {
  background = loadImage("images/background.png");
  melonImg = loadImage("images/melon.png");
  cueioImg = loadImage("images/rabbit1.png");
  idle = loadAnimation("images/rabbit1.png","images/rabbit1.png","images/rabbit2.png");
  eat = loadAnimation("images/eat.png","images/eat_2.png","images/eat_3.png","images/eat_4.png");
  sad = loadAnimation("images/sad_1.png","images/sad_2.png","images/sad_3.png");
  eat.looping = false;
  sad.looping = false;

  air = loadSound("sounds/air.wav");
  eating = loadSound("sounds/eating_sound.mp3");
  corte = loadSound("sounds/rope_cut.mp3");
  triste = loadSound("sounds/sad.wav");
  music = loadSound("sounds/sound1.mp3");
}

function setup() {
  createCanvas(500, 700);
  engine = Engine.create();
  world = engine.world;

  rectMode(CENTER);
  ellipseMode(RADIUS);
  imageMode(CENTER);
  textSize(50);

  var options = {
    isStatic: true,
  };

  chao = Bodies.rectangle(250, 690, 500, 20, options);
  World.add(world, chao);

  corda = new Rope(3,{x:250,y:30});
  corda2 = new Rope(6,{x:250,y:500});

  melon = Bodies.circle(250,300,20);
  Composite.add(corda.body, melon);

  link = new Link(corda, melon);
  link2 = new Link(corda2, melon);


  cueio = createSprite(400,550,30,30);
  cueio.scale = 0.3
  idle.frameDelay = 30;
  eat.frameDelay = 20;
  sad.frameDelay = 15;
  cueio.addAnimation("piscar", idle);
  cueio.addAnimation("comer", eat);
  cueio.addAnimation("triste", sad);

  botao = createImg("images/cut_btn.png");
  botao.size(80,80);
  botao.position(250,25);
  botao.mouseClicked(cortar);

  balao = createImg("images/balloon.png");
  balao.size(150,100);
  balao.position(40,200);
  balao.mouseClicked(soprar);

  music.play();
  music.setVolume(0.2);

  mute = createImg("images/mute.png");
  mute.size(50,50);
  mute.position(5,640);
  mute.mouseClicked(mutar);

  botao2 = createImg("images/cut_btn.png");
  botao2.size(80,80);
  botao2.position(170,500);
  botao2.mouseClicked(cortar2);
}

function draw() {
  image(background,250,350,500,700);

  Engine.update(engine);

  corda.show();
  corda2.show();

  if(melon != null) {
  image(melonImg, melon.position.x, melon.position.y, 80, 80);
  }

  if(melon != null && melon.position.y > 600){
    cueio.changeAnimation("triste");
    melon = null;
    triste.play();
  }

  if(colisao(melon, cueio) === true){
    cueio.changeAnimation("comer");
    eating.play();
  }

 drawSprites();
}

function cortar() {
  corda.break();
  link.break();
  corte.play();
}

function cortar2() {
  corda2.break();
  link2.break();
  corte.play();
}

function colisao(body,sprite) {
  if(melon != null){
    var distance = dist(body.position.x, body.position.y, sprite.position.x, sprite.position.y);
    if(distance <= 80){
      World.remove(world, melon);
      melon = null;
      return true;
    }else{
      return false;
    }
  }
}

function soprar() {
  Matter.Body.applyForce(melon,{x:0, y:0},{x:0.05, y:0});
  air.play();
}

function mutar() {
  if(music.isPlaying()){
    music.stop();
  }else{music.play();}
}