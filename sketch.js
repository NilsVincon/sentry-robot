//Code démonstrateur d6 Nils Vinçon et Nathanael Primerose 


//Création des variables 

let imageModelURL = "https://teachablemachine.withgoogle.com/models/AotyA67h4/";
let img;
let longueurecran = 1280;
let hauteurecran = 720;
let video;
let flippedVideo;
let label = "";
let lcam = 300;
let hcam = 230;
let posxcam = 25;
let posycam = 175;
let isVisible = true;
let classifier;
let angle;
let direction = "";
let angle1;
let droit = 1;
let wheelPosition = 0;
let wheelSpeed = 2;
let positionvoitureX;
let positionvoitureY;
let transx;
let transy;
let petitx;
let petity;
let angle5 = 0;
let angle6 = 0;
let vitessePetitevoiture = 1;
let button1;
let button2;
let button3;
let vitesserotation = 0.04;
let anglerotvitesse = 0.04;
let epaisseur = 9;
let pointe = 120;
let angleboussole;
let rayon = 65;
let voiturelarg = 50;
let voiturelong = 1.5 * voiturelarg;
let panneaux;
let panneauy;
let couleur;
let sens;
let start = "";
let secu = "";
let avancer = "";

//Chargement du retour vidéo 

function preload() {
  classifier = ml5.imageClassifier(imageModelURL + "model.json");
  img = loadImage("reload.png");
}


function setup() {
  mainCanvas = createCanvas(longueurecran, hauteurecran); //Créer le caneva
  video = createCapture(VIDEO); //Créer la capture vidéo
  video.size(lcam, hcam); //Dimmensionnement de la capture vidéo
  video.hide(); //On cache la vidéo
  flippedVideo = ml5.flipImage(video); //Inverse horizontalement la vidéo
  classifyVideo();//Classification en temps réel de la vidéo
  //Initialisation des variables
  angle1 = 0;  
  angleboussole = PI / 4;
  transx = longueurecran - 155;
  transy = 160;
  positionvoitureX = transx - voiturelarg / 2;
  positionvoitureY = transy - voiturelong / 2;
  petitx = 640;
  petity = 570;
  angle = 0;
  angle6 = angle5 = PI / 2;
  start = "no";
  secu = "";  
  //Création du bouton START
  button1 = createButton(""); //Création du bouton 1
  button1.position(415, 595); //Placement du bouton 1
  button1.size(45, 45); //Dimensionnement du bouton 1
  button1.style("clip-path", "polygon(0% 100%, 0% 0%, 100% 50%)"); //Définition de la géométrie triangulaire du bouton 1
  button1.style("background-color", "rgb(11,110,79)");//Définition de la couleur du bouton 1 
  button1.mousePressed(getstart); //Commande qui permet d'appeler la fonction getstart lorsque le bouton START est appuyé
  //Création du bouton STOP
  button2 = createButton("");//Création du bouton 2
  button2.position(470, 595); //Placement du bouton 2
  button2.size(40, 40); //Dimensionnement du bouton 2
  button2.style("clip-path", "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)");//Définition de la géométrie carré du bouton 2
  button2.style("background-color", "rgb(201,82,39)"); //Définition de la couleur du bouton 2 
  button2.mousePressed(getstop); //Commande qui permet d'appeler la fonction getstop lorsque le bouton STOP est appuyé
  //Création du bouton RESTART
  button3 = createButton("");//Création du bouton 3
  button3.position(520, 597);//Placement du bouton 3
  button3.size(40, 40); //Dimensionnement du bouton 3
  button3.class("custom-button"); //Définition de la couleur du bouton 3
  button3.style("background-color", "transparent");
  button3.mousePressed(restart); //Commande qui permet d'appeler la fonction restart lorsque le bouton RESTART est appuyé

  setInterval(function () {
    isVisible = !isVisible;   //Permet de définir une fréquence pour l'affichage 
  }, 300);
}

function draw() {
background(200);            //Couleur du canva
  affichageUtilisateur(); //Appel de la fonction affichageUtilisateur
  frameRate(1); //Définit la fréquence à 1 image/s
  foret(390, 60, 2000, 720); //Créer la foret 1 fois par seconde (pas 60 fois pour éviter les lags)
  frameRate(60); //Définit la fréquence à 60 image/s
  fill(79, 72, 93);
  rect(400, 585, 170, 65); //Créer le rectangle sur lequel sont les trois boutons
  affichageCircuit(); //Appel de fonction 
  affichageBoussoleVoiture(); //Appel de fonction 
  lignedepart(615, 530); //Appel de fonction 
  feu(680, 480); //Appel de fonction 

  if (start == "no") {  //Itération permettant d'arrêter la voiture si le bouton STOP a été appuyé ou si le bouton START n'a pas été appuyé
    petitevoiture(petitx, petity); // Création voiture sur la ligne de départ
    push(); //Tous les push et pop présent dans le code permettent d'enregistrer les données d'écriture et pop de restaurer les données utilisé avant le push
    translate(transx, transy);//Tous les translate permettent, dans le push, de se placer à un endroit particulier
    rotate(angle); //Tous les rotates permettent que les objets qui suivent le rotate effectuent une rotation d'un angle donnée
    voiture(positionvoitureX - transx, positionvoitureY - transy, voiturelarg, voiturelong);
    robot();
    pop();
  } else { //Si le bouton STOP n'a pas été appuyé ou si le bouton START a été appuyé, la voiture avance
    if (direction === "") { //Permet d'initialiser la position des voitures 
      voiture(positionvoitureX, positionvoitureY, voiturelarg, voiturelong);
      push();
      translate(transx, transy);
      robot();
      pop();
      angle1 = 0;
      petitevoiture(petitx, petity);
    }

    if (label === "gauche") { //Si le label (donné par l'IA) vaut gauche, alors la direction est égal à 1.
      direction = 1;          //Permet de connaitre la rotation à realiser selon le panneaux 
      if (isVisible) {      //Permet de changer la couleur du triangle selon la fréquence définie dans le setup pour isVisible
        fill(255, 0, 0);    //couleur
        rect(190, hauteurecran - 110, 90, 40);
        triangle(280, hauteurecran - 130, 280, hauteurecran - 50, 335, hauteurecran - 90);
      }
    }
    if (label === "droite") { //Si le label (donné par l'IA) vaut droite, alors la direction est égal à 2.
      direction = 2;
      if (isVisible) {    //Permet de changer la couleur du triangle selon la fréquence définie dans le setup pour isVisible
        // Dessiner le rectangle lorsque l'état de visibilité est vrai
        fill(255, 0, 0);
        rect(190, hauteurecran - 110, 90, 40);
        triangle(280, hauteurecran - 130, 280, hauteurecran - 50, 335, hauteurecran - 90);
      }
    }
    if (label === "rien") { //Si le label (donné par l'IA) vaut rien, alors la direction est égal à 3.
      droit = 1;  //La variable droit permet d'empêcher à la variable label de changer de valeur tant que la rotation complète 
      //du véhicule n'est pas finie
      direction = 3;
      avancer='yes'; //La variable indiquant si la voiture bouge ou non à la valeur de 'yes' donc la voiture roule
    }

    if (direction === 1) { //Si la direction vaut 1 (gauche), la grande voiture va effectuer une rotation de -PI/2.
      droit = 0;
      avancer='no'; //La variable indiquant si la voiture bouge ou non à la valeur de 'no' donc la voiture est arrêtée
      push();
      translate(transx, transy);
      if (angle < angle1 - PI / 2) {
        angle = angle1 - PI / 2; //Permet de sauvegarder l'angle de la grande voiture
        angle1 = angle; 
        droit = 1;
        angle6 = angle5 - PI / 2; //Permet de sauvegarder l'angle de rotation de la petite voiture
        angle5 = angle6;
        avancer = 'yes'; //La variable indiquant si la voiture bouge ou non à la valeur de 'yes' donc la voiture roule
      } else {
        rotate(angle);
        angle -= vitesserotation; //Permet de faire une rotation degrés par degrés et non juste une rotation instantanée
        voiture(positionvoitureX - transx, positionvoitureY - transy, voiturelarg, voiturelong);
        robot();
        pop();
      }

      //Fleche gauche
    }

    if (direction === 2) { //Si la direction vaut 2 (droite), la grande voiture va effectuer une rotation de PI/2
      droit = 0;
      avancer ='no'; //La variable indiquant si la voiture bouge ou non à la valeur de 'no' donc la voiture est arrêtée
      push();
      translate(transx, transy);
      if (angle > angle1 + PI / 2) {
        angle = angle1 + PI / 2; //Permet de sauvegarder l'angle de la grande voiture
        angle1 = angle;
        droit = 1;
        angle6 = angle5 + PI / 2;   //Permet de sauvegarder l'angle de rotation de la petite voiture
        angle5 = angle6;

      } else {
        rotate(angle);
        angle += vitesserotation;
        voiture(positionvoitureX - transx, positionvoitureY - transy, voiturelarg, voiturelong);
        robot();
        pop();
      }
    }
    if (direction === 3) { //Si la direction vaut 3 (rien), la grande voiture va avancer selon la dernière direction indiqué
      push();
      translate(transx, transy);
      rotate(angle);
      voiture(positionvoitureX - transx, positionvoitureY - transy, voiturelarg, voiturelong);
      robot();
      pop();
      directionPetiteVoiture(angle6, petitx, petity); //Fonction qui permet de gérer le mouvement de la voiture
    }
    securite(petitx, petity);         //Fonction qui assure que la petite voiture ne quittera pas l'espace dédié à ses déplacements
    directionPetiteVoiture(angle6, petitx, petity);
  }
}

function classifyVideo() {                        //Affiche le retour video de la camera
  flippedVideo = ml5.flipImage(video);
  classifier.classify(flippedVideo, gotResult);
  flippedVideo.remove();
}

function gotResult(error, results) {            //Confirme s'il y a un retour video fonctionnnel
  if (error) {
    console.error(error);
    return;
  }
  if (droit === 1) { //Permet que la variable label ne change que si la variable droit à la valeur 1   
    label = results[0].label;
  }
  classifyVideo();
}

function affichageUtilisateur() {           //Affichage de l'interface 'Utilisateur + video + direction (texte + fleche)
  //Affichage partie "UTILISATEUR"
  rectMode(CORNER);
  fill(255, 188, 66);
  strokeWeight(0);
  rect(10, 15, 330, 90);
  fill(255);
  textSize(40);
  textAlign(CENTER);
  textStyle("normal");
  textFont("Calibri");
  text("Utilisateur", posxcam + lcam / 2, 75);

  // Affichage partie video 
  fill(255, 188, 66);
  strokeWeight(0);
  rect(10, 110, 330, hauteurecran - 120);
  strokeWeight(0);
  fill(255);
  textSize(30);
  textAlign(LEFT);
  textStyle("normal");
  textFont("Calibri");
  text("Retour video :", 95, 150);
  image(flippedVideo, posxcam, posycam);

  // Affichage partie direction - texte 
  fill(255, 50);
  strokeWeight(0);
  ellipse(posxcam + lcam / 2, hcam + posycam + 90, 250, 90);
  fill(255);
  strokeWeight(0);
  textSize(40);
  textStyle("normal");
  textAlign(CENTER);
  text(label, posxcam + lcam / 2, hcam + posycam + 100);

    // Affichage partie direction - fleche
  fill(255, 255, 255);
  triangle(20,hauteurecran - 90,75,hauteurecran - 130,75, hauteurecran - 50);
  rect(75, hauteurecran - 110, 90, 40);

  rect(190, hauteurecran - 110, 90, 40);
  triangle(280,hauteurecran - 130,
    280,hauteurecran - 50,335,hauteurecran - 90);

    // Affichage fond circuit 
  fill(200);
  strokeWeight(0);
  rect(350, 15, longueurecran - 390, hauteurecran - 25);
}

function affichageBoussoleVoiture() {   //Affiche la partie de la boussole (pas la grande voiture)

  //Affichage carré en fond
  fill(255, 188, 66);
  strokeWeight(0);
  rect(longueurecran - 330, 0, 350, 330);
  fill(255, 50);
  rect(longueurecran - 330, 0, 350, 330);

  // Affichage boussole 
  fill(0, 0, 0);
  strokeWeight(1);
  textSize(30);
  textStyle(BOLD);
  textAlign(CENTER);
  textFont("Georgia");
  text("N", transx, transy - pointe - 10);
  text("S", transx, transy + pointe + 40);
  text("E", transx + pointe + 18, transy + 12);
  text("W", transx - pointe - 25, transy + 12);
  textSize(10);
  textStyle(BOLDITALIC);
  text("NW", transx - pointe / 1.5, transy - pointe / 1.5);
  text("NE", transx + pointe / 1.5, transy - pointe / 1.5);
  text("SW", transx - 10 - pointe / 1.5, transy + pointe / 1.5);
  text("SE", transx + 10 + pointe / 1.5, transy + pointe / 1.5);
  //Cercle boussole
  fill(255, 255, 255, 0.6);
  ellipse(transx, transy, rayon * 2 - 15, rayon * 2 - 15);

  // Fleche bousole
  strokeWeight(1);
  fill(255, 255, 255);

  // Cardinal NSEW 
  triangle(transx,transy - pointe,transx + epaisseur,transy - rayon,transx - epaisseur,transy - rayon);
  triangle(transx + rayon,transy + epaisseur,transx + rayon,transy - epaisseur,transx + pointe,transy);
  triangle(transx,transy + pointe,transx + epaisseur,transy + rayon,transx - epaisseur,transy + rayon);
  triangle(transx - rayon,transy + epaisseur,transx - rayon,transy - epaisseur,transx - pointe,transy);
  // Cardinal NW-NE-SW-SE
  for (let i = 0; i < 4; i++) {
    push();
    translate(transx, transy);
    rotate(angleboussole);
    triangle(0,rayon - 40 + pointe / 2,epaisseur / 2,rayon,-epaisseur / 2,rayon);
    angleboussole += PI / 2;
    pop();
  }
}

function roues(posxV, posyV) { //Quand la fonction roues est appelé, les 4 roues sont créés selon posxV et posyV
  push();
  fill(120);
  translate(posxV, posyV); //On se place au point de coordonné (posxV,posyV)
  rect(0, -3, (voiturelarg / 100) * 20, (voiturelong / 150) * 43); //On créé un rectangle représentant la roue
  if (start == "yes") { //Si le bouton START à été appuyé, les rainures sur la roues vont translater du haut vers le bas de la roue 
    //pour donner l'impression que celle-ci roule. 
    translate(0, wheelPosition);
  }
  strokeWeight(1); //Permet de faire des rainures fines
  //Création des rainues de la roues
  line(((voiturelarg / 100) * 20 * 1) / 3,0,((voiturelarg / 100) * 20 * 1) / 3,(voiturelong / 150) * 40);
  line(0,0,((voiturelarg / 100) * 20 * 1) / 3,((voiturelong / 150) * 40 * 1) / 4);
  line(0,((voiturelong / 150) * 40 * 1) / 4,((voiturelarg / 100) * 20 * 1) / 3,((voiturelong / 150) * 40 * 2) / 4);
  line(0,((voiturelong / 150) * 40 * 2) / 4,((voiturelarg / 100) * 20 * 1) / 3,((voiturelong / 150) * 40 * 3) / 4);
  line(0,((voiturelong / 150) * 40 * 3) / 4,((voiturelarg / 100) * 20 * 1) / 3,((voiturelong / 150) * 40 * 4) / 4);
  line(((voiturelarg / 100) * 20 * 2) / 3,0,((voiturelarg / 100) * 20 * 2) / 3,(voiturelong / 150) * 40);
  line((voiturelarg / 100) * 20,0,((voiturelarg / 100) * 20 * 2) / 3,((voiturelong / 150) * 40 * 1) / 4);
  line((voiturelarg / 100) * 20,((voiturelong / 150) * 40 * 1) / 4,((voiturelarg / 100) * 20 * 2) / 3,((voiturelong / 150) * 40 * 2) / 4);
  line((voiturelarg / 100) * 20,((voiturelong / 150) * 40 * 2) / 4,((voiturelarg / 100) * 20 * 2) / 3,((voiturelong / 150) * 40 * 3) / 4);
  line((voiturelarg / 100) * 20,((voiturelong / 150) * 40 * 3) / 4,((voiturelarg / 100) * 20 * 2) / 3,((voiturelong / 150) * 40 * 4) / 4);
  wheelPosition += wheelSpeed;
  if (wheelPosition > 1) {
    wheelPosition = -3;
  }
  pop();
}

function voiture(posvoitX, posvoitY, largvoit, longvoit) { //Lorsque l'on appelle cette fonction, une voiture est créer selon les paramètres
  //suivant : coordonnée en X (posvoitX), coordonnée en Y (posvoitY); largeur de la voiture (largvoit) et longueur de la voiture (longvoit)
  push(); 
  translate(0, 0);
  fill(170);
  rect(posvoitX, posvoitY, largvoit, longvoit);//Créer le rectanle représentant la voiture
  fill(230);
  rect(posvoitX + 10, posvoitY + 10, largvoit - 20.5, longvoit - 20); //Créer le rectanle représentant le toit
  fill(255, 255, 0);
  rect(posvoitX + 18, posvoitY, largvoit - 61, longvoit - 80);//Créer le rectanle représentant le phare gauche
  rect(posvoitX + 43, posvoitY, largvoit - 61, longvoit - 80);//Créer le rectanle représentant le phare droit
  pop();
}

function robot() { //Quand cette fonction est appelé, les 4 roues de la grande voiture sont créée.
  roues(-35, -34); 
  roues(25, -34);
  roues(-35, 20);
  roues(25, 20);
}

function panneau(panneaux, panneauy, couleur, sens) { // Affiche un panneau différent selon les coordonnées,la couleur et le sens
  push();
  strokeWeight(2);
  translate(panneaux, panneauy);
  if (sens == -PI) {      //Vers la auche
    rotate(0);
    if (couleur == "rouge") {
      fill(187, 30, 30);
    }
    if (couleur == "vert") {
      fill(92, 171, 26);
    }
  }
  if (sens == PI / 2) {   //Vers le haut
    rotate(sens);
    if (couleur == "rouge") {
      fill(187, 30, 30);
    }
    if (couleur == "vert") {
      fill(92, 171, 26);
    }
  }
  if (sens == PI) {     //Vers la droite
    rotate(sens);
    if (couleur == "rouge") {
      fill(187, 30, 30);
    }
    if (couleur == "vert") {
      fill(92, 171, 26);
    }
  }
  if (sens == -PI / 2) {    //Vers le bas
    rotate(sens);
    if (couleur == "rouge") {
      fill(187, 30, 30);
    }
    if (couleur == "vert") {
      fill(92, 171, 26);
    }
  }
  //Création du panneau
  rect(0, 0, 40, 20);
  fill(0);
  line(30, 10, 10, 10);
  line(10, 10, 15, 5);
  line(10, 10, 15, 15);
  pop();
}

function affichageCircuit() { //Permet de créer le circuit que la voiture va emprunter
  //Affichage circuit - bordure
  strokeWeight(50);
  stroke(175, 96, 26);
  line(650, hauteurecran - 50, 650, hauteurecran / 2 + 50);
  line(650, hauteurecran / 2 + 50, 500, hauteurecran / 2 + 50);
  line(500, hauteurecran / 2 + 50, 500, 250);
  line(500, 250, 400, 250);
  line(400, 250, 400, 100);
  line(400, 100, 900, 100);
  line(900, 100, 900, hauteurecran / 2 + 80);
  line(900, hauteurecran / 2 + 80, longueurecran - 200, hauteurecran / 2 + 80);
  line(longueurecran - 200,hauteurecran / 2 + 80,longueurecran - 200,hauteurecran - 125);
  line(longueurecran - 200,hauteurecran - 125,longueurecran / 2 + 100,hauteurecran - 125);
  line(longueurecran / 2 + 100,hauteurecran - 125,longueurecran / 2 + 100,hauteurecran - 50);
  line(650, hauteurecran - 50, longueurecran / 2 + 100, hauteurecran - 50);
  //Affichage circuit - chemin
  strokeWeight(40);
  stroke(225, 225, 200);
  line(650, hauteurecran - 50, 650, hauteurecran / 2 + 50);
  line(650, hauteurecran / 2 + 50, 500, hauteurecran / 2 + 50);
  line(500, hauteurecran / 2 + 50, 500, 250);
  line(500, 250, 400, 250);
  line(400, 250, 400, 100);
  line(400, 100, 900, 100);
  line(900, 100, 900, hauteurecran / 2 + 80);
  line(900, hauteurecran / 2 + 80, longueurecran - 200, hauteurecran / 2 + 80);
  line(longueurecran - 200,hauteurecran / 2 + 80,longueurecran - 200,hauteurecran - 125);
  line(longueurecran - 200,hauteurecran - 125,longueurecran / 2 + 100,hauteurecran - 125);
  line(longueurecran / 2 + 100,hauteurecran - 125,longueurecran / 2 + 100,hauteurecran - 50);
  line(650, hauteurecran - 50, longueurecran / 2 + 100, hauteurecran - 50);

  //Panneaus du circuit
  strokeWeight(1);
  stroke(0);
  panneau(629, hauteurecran / 2 - 5, "rouge", -PI);
  panneau(460, hauteurecran / 2 + 25, "vert", PI / 2);
  panneau(480, 190, "rouge", -PI);
  panneau(370, 230, "vert", PI / 2);
  panneau(420, 65, "vert", PI);
  panneau(927, 125, "vert", -PI / 2);
  panneau(920, hauteurecran / 2 + 135, "rouge", PI);
  panneau(longueurecran - 165, hauteurecran / 2 + 110, "vert", -PI / 2);
  panneau(longueurecran - 220, hauteurecran - 90, "vert", -PI);
  panneau(longueurecran / 2 + 50, hauteurecran - 105, "rouge", -PI / 2);
  panneau(longueurecran / 2 + 80, hauteurecran - 23, "vert", -PI);
  panneau(618, hauteurecran - 70, "vert", PI / 2);
}

function petitevoiture(posX, posY) {  //Fonction qui affiche la petite voiture sur le circuit à la position (posX,posY)
  if (secu == "no") {     //Cas où la voiture sort de la zone du circuit
    if (isVisible) {      //Définie une fréquence d'affichage
      // Dessiner le rectangle lorsque l'état de visibilité est vrai
      fill(255, 0, 0);
      ellipse(petitx + 10, petity, 25, 25); //petite voiture clignotant en rouge
    }
  } else {      //Cas où la voiture est dans la zone du circuit
    fill(255, 255, 255);
    push();
    translate(posX, posY);
    ellipse(10, 0, 25, 25); //Point blanc qui représente la petite voiture
    pop();
  }
}

function directionPetiteVoiture(angle, posX, posY) {    //Gère le déplacement de la petite voiture
  petitx = posX;      //Position de la petite voiture selon x
  petity = posY;      //Position de la petite voiture selon y
  while (angle > 3 * (PI / 2)) {    // Dans le cas ou la somme de l'angle de la petite votiure supérieur à 4 (nb de rotation possible)
    angle = angle - 2 * PI;         // Réduction de l'angle jusqu'à obtenir son équivalent dans la zone pris en charge
  }
  while (angle < 0) {               // Dans le cas ou la somme de l'angle est négatif (non pris en charge)
    angle = angle + 2 * PI;         //Augmente l'angle jusqu'à atteindre son équivalent dans la zone prise en charge
  }
  for (k = 0; k < 3; k++) {        
    if (angle == k * (PI / 2)) {       //Vérifie que l'angle est dans la zone prise en charge pour la rotation de la voiture
      if (angle == 0) {                 
        petitx -= vitessePetitevoiture;   //Se déplace à gauche
      }
      if (angle == PI / 2) {                  
        petity -= vitessePetitevoiture;   // Se déplace en haut
      }
      if (angle == PI) {
        petitx += vitessePetitevoiture;   //Se déplace à droite
      }
      if (angle == 3 * (PI / 2)) {
        petity += vitessePetitevoiture;   //Se déplace en bas
      }
      petitevoiture(petitx, petity);      //Création de la petite voiture 
    }
  }
  //print(angle);  //Affichage de la valeur de l'angle
}

function lignedepart(px, py) { //Fonction qui créer la ligne de départ en damier noir et blanc
  fill(250);
  rect(px, py, 70, 20);
  for (x = 0; x < 65; x += 10) {
    fill(0);
    rect(px + x, py, 5, 5);
    rect(px + 5 + x, py + 5, 5, 5);
    rect(px + x, py + 10, 5, 5);
    rect(px + 5 + x, py + 15, 5, 5);
  }
}

function feu(xx, yy) { //Fonction qui créer le feu de signalisation qui est soit vert soit rouge.
  fill(180);
  rect(xx, yy, 20, 35);
  fill(250);
  ellipse(xx + 10, yy + 10, 12.5, 12.5);
  if (start == "yes") { //Si le bouton START à été appuyé,  le feu est vert
    fill(0, 250, 0);
    ellipse(xx + 10, yy + 10, 12.5, 12.5);
    fill(250);
    ellipse(xx + 10, yy + 26.5, 12.5, 12.5);
  }
  if (start == "no") { //Si le bouton STOP à été appuyé ou que le bouton START n'a pas été appuyé,  le feu est rouge
    fill(250, 0, 0);
    ellipse(xx + 10, yy + 26.5, 12.5, 12.5);
  }
}

function getstart() { //Fonction utilisé lorsque l'on appuie sur le bouton START
  start = "yes"; //La variable définissant l'état START ou STOP prend la valeur 'yes'
  secu = "";      // Réinitialise la valeur de la variable qui assure que la petite voiture est dans la zone du circuit
}

function getstop() { //Fonction utilisé lorsque l'on appuie sur le bouton STOP
  start = "no"; //La variable définissant l'état START ou STOP prend la valeur 'no'
}
function restart() { //Fonction utilisé lorsque l'on appuie sur le bouton RESTART
  setup(); //Cela relance le setup, cela réinitialise donc les variables
}
function arbre1(x, y) { //Fonction qui créer l'arbre 1
  fill(135, 54, 0);
  rect(x, y, 10, 20);
  fill(52, 148, 98);
  ellipse(x + 5, y - 15, 30, 40);
}

function arbre2(x, y) { //Fonction qui créer l'arbre 2
  fill(135, 54, 0);
  rect(x, y, 10, 20);
  fill(11, 110, 79);
  triangle(x - 10, y + 10, x + 5, y - 10, x + 20, y + 10);
  triangle(x - 10, y, x + 5, y - 20, x + 20, y);
  triangle(x - 10, y - 10, x + 5, y - 25, x + 20, y - 10);
}
function arbre3(x, y) { //Fonction qui créer l'arbre 3
  fill(135, 54, 0);
  rect(x, y, 10, 20);
  fill(2, 120, 18);
  ellipse(x, y, 18, 20);
  ellipse(x + 10, y, 18, 20);
  ellipse(x, y - 10, 20, 25);
  ellipse(x + 10, y - 10, 20, 25);
}
function foret(taillex, tailley, taillexmax, tailleymax) { //Fonction qui place les arbres 1,2 et 3
  for (x = taillex; x < taillexmax; x += 130) { //Permet que les arbres ne soient pas en dehors du canevas
    for (y = tailley; y < tailleymax; y += 80) { //Permet que les arbres ne soient pas en dehors du canevas
      arbre1(x, y);
      arbre2(x + 30, y);
      arbre3(x + 60, y);
    }
  }
}
function securite(petitx, petity) {       //assure que la petite voiture reste dans la zone du circuit
  if (petitx < 355 || petitx > longueurecran - 25 || petity < 30 || petity > hauteurecran - 30) {  //Zone du circuit
    start = "no";     //La petite voiture s'arrete
    secu = "no";      // variable indiquant que la petite voiture va quitter la zone du cu=ircuit
  }
  if (petitx > longueurecran - 330 && petity < 330) {           //Cas où elle ira derrière la boussole
    start = "no";
    secu = "no";
  }
}
