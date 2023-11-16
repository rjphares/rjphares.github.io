//to do:
//get help with memory leak - markedfordeletion needs to be run before every new game?
//add clean up
//add sound effects

/*
#define SharkWid 64
#define SharkHei 32
#define ScubaWid 48
#define ScubaHei 24

TIMES 3
#define SharkWid 64x3 = 192
#define SharkHei 32x3 = 96
#define ScubaWid 48x3 = 144
#define ScubaHei 24x3 = 72
*/

window.addEventListener('load', function() {
    //canvas setup
    let grid = document.getElementById('grid');
    let newGame = document.getElementById('new');
    let resume = document.getElementById('resume');
    let skip = document.getElementById('skip');
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    let restart = false;
    let skipLevel = false;
    let Menu = true;
    let letterWave = 0;
    let letterWaveExtra = 0;
    let globalTime = 0;
    canvas.width = 1920;
    canvas.height = 1080;
    //constants
    const sharkHei = 96;
    const sharkWid = 192;
    //font
    const font = new FontFace('myFont', 'url("fonts/Ocean Rush.otf")');
    document.fonts.add(font);
    font.load();

    //diver up/down and menus
    class InputHandler {
        constructor(game) {
            this.game = game;
            newGame.addEventListener("click", function() { 
                restart = true;
                grid.style.display = "none";
                Menu = false;
            });

            resume.addEventListener("click", function() { 
                grid.style.display = "none";
                Menu = false;
            });

            skip.addEventListener("click", function() { 
                if (game.level >= 0 && game.level <= 14) {
                    skipLevel = true;
                    grid.style.display = "none";
                    Menu = false;
                }
            });

            window.addEventListener('keydown', e => {
                if ((   (e.key === 'ArrowUp' ) ||
                        (e.key === 'ArrowDown')
                ) && this.game.keys.indexOf(e.key) === -1) {
                    this.game.keys.push(e.key);
                }
                if ((   (e.key === ' ' )
                ) && this.game.keys.indexOf(e.key) === -1) {
                    this.game.keys.push(e.key);
                    if (Menu) {
                        grid.style.display = "none";
                        Menu = false;
                    }
                    else Menu = true;
                }
            });
            window.addEventListener('keyup', e => {
                if (this.game.keys.indexOf(e.key) > -1) {
                    this.game.keys.splice(this.game.keys.indexOf(e.key), 1);
                }
            })
        }
    }

    //diver
    class Player {
        constructor(game) {
            this.game = game;
            this.width = 144;
            this.height = 72;
            this.x = 0;
            this.y = 0;
            this.speedY = 0;
            this.maxSpeed = 0.25;
            this.projectiles = [];
            this.image = document.getElementById('diver');
        }

        //diver up/down
        update(deltaTime) {
            if (this.game.keys.includes('ArrowUp')) this.speedY = -this.maxSpeed;
            if (this.game.keys.includes('ArrowDown')) this.speedY = this.maxSpeed;
            if ((!this.game.keys.includes('ArrowUp') && 
                !this.game.keys.includes('ArrowDown')) ||
                (this.game.keys.includes('ArrowUp') && 
                this.game.keys.includes('ArrowDown'))) this.speedY = 0;
            this.y += this.speedY*deltaTime;
        }

        draw(context) {
            context.drawImage(this.image, this.x, this.y);
        }
    }

    //shark
    class Enemy {
        constructor(game) {
            this.game = game;
            this.speedX = -0.25;
            this.repeatCount = 0;
            this.markedForDeletion = false;
            this.open = false;
            this.image0 = document.getElementById('shark_relaxed');
            this.image1 = document.getElementById('shark_attack');
            this.alarmSound = false;
        }

        update(deltaTime) {
            this.x += this.speedX*deltaTime;
            if (this.repeatCount === 2) {
                this.markedForDeletion = true;
            }
            if (this.x + this.width < 0 && this.repeatCount < 2) {
                this.x = this.xStart - (this.xStart - canvas.width);
                this.repeatCount++;
            }
        }

        draw(context) {
            if (!this.open) context.drawImage(this.image0, this.x, this.y);
            else context.drawImage(this.image1, this.x, this.y);
        }
    }

    //individual shark settings
    class Shark extends Enemy {
        constructor(game, xStart, yStart) {
            super(game);
            this.width = 192;
            this.height = 96;
            this.xStart = xStart;
            this.x = xStart;
            this.y = yStart;
        }
    }

    class Letters {
        constructor(game) {
            this.game = game;
            this.speedX = -0.125;
            this.markedForDeletion = false;
            this.score = 100;
            this.imageA = document.getElementById('A');
            this.imageB = document.getElementById('B');
            this.imageC = document.getElementById('C');
            this.imageD = document.getElementById('D');
            this.imageE = document.getElementById('E');
            this.imageF = document.getElementById('F');
            this.imageG = document.getElementById('G');
            this.imageH = document.getElementById('H');
            this.imageI = document.getElementById('I');
            this.imageJ = document.getElementById('J');
            this.imageK = document.getElementById('K');
            this.imageL = document.getElementById('L');
            this.imageM = document.getElementById('M');
            this.imageN = document.getElementById('N');
            this.imageO = document.getElementById('O');
            this.imageP = document.getElementById('P');
            this.imageQ = document.getElementById('Q');
            this.imageR = document.getElementById('R');
            this.imageS = document.getElementById('S');
            this.imageT = document.getElementById('T');
            this.imageU = document.getElementById('U');
            this.imageV = document.getElementById('V');
            this.imageW = document.getElementById('W');
            this.imageX = document.getElementById('X');
            this.imageY = document.getElementById('Y');
            this.imageZ = document.getElementById('Z');
        }

        update(deltaTime) {
            this.x += this.speedX*deltaTime;
            if (this.x + this.width < 0) this.markedForDeletion = true;
        }

        draw(context) {
            if (this.game.level === 0) context.drawImage(this.imageA, this.x, this.y);
            if (this.game.level === 1) context.drawImage(this.imageB, this.x, this.y);
            if (this.game.level === 2) context.drawImage(this.imageC, this.x, this.y);
            if (this.game.level === 3) context.drawImage(this.imageD, this.x, this.y);
            if (this.game.level === 4) context.drawImage(this.imageE, this.x, this.y);
            if (this.game.level === 5) context.drawImage(this.imageF, this.x, this.y);
            if (this.game.level === 6) context.drawImage(this.imageG, this.x, this.y);
            if (this.game.level === 7) {
                if (this.index === 7) context.drawImage(this.imageH, this.x, this.y);
                if (this.index === 8) context.drawImage(this.imageI, this.x, this.y);
            }
            if (this.game.level === 8) {
                if (this.index === 9) context.drawImage(this.imageJ, this.x, this.y);
                if (this.index === 10) context.drawImage(this.imageK, this.x, this.y);
            }
            if (this.game.level === 9) {
                if (this.index === 11) context.drawImage(this.imageL, this.x, this.y);
                if (this.index === 12) context.drawImage(this.imageM, this.x, this.y);
            }
            if (this.game.level === 10) {
                if (this.index === 13) context.drawImage(this.imageN, this.x, this.y);
                if (this.index === 14) context.drawImage(this.imageO, this.x, this.y);
            }
            if (this.game.level === 11) {
                if (this.index === 15) context.drawImage(this.imageP, this.x, this.y);
                if (this.index === 16) context.drawImage(this.imageQ, this.x, this.y);
            }
            if (this.game.level === 12) {
                if (this.index === 17) context.drawImage(this.imageR, this.x, this.y);
                if (this.index === 18) context.drawImage(this.imageS, this.x, this.y);
                if (this.index === 19) context.drawImage(this.imageT, this.x, this.y);
            }
            if (this.game.level === 13) {
                if (this.index === 20) context.drawImage(this.imageU, this.x, this.y);
                if (this.index === 21) context.drawImage(this.imageV, this.x, this.y);
                if (this.index === 22) context.drawImage(this.imageW, this.x, this.y);
            }
            if (this.game.level === 14) {
                if (this.index === 23) context.drawImage(this.imageX, this.x, this.y);
                if (this.index === 24) context.drawImage(this.imageY, this.x, this.y);
                if (this.index === 25) context.drawImage(this.imageZ, this.x, this.y);
            }
        }
    }

    //individual letter settings
    class Letter extends Letters {
        constructor(game, index, xStart, yStart, last) {
            super(game);
            this.index = index;
            this.width = 30;
            this.height = 42;
            this.x = xStart;
            this.y = yStart;
            this.last = last;
        }
    }

    //show score and current level
    class UI {
        constructor(game) {
            this.game = game;
            this.fontSize = 72;
            this.fontFamily = 'Helvetica'; 
            this.color = 'white';
        }
        
        draw(context) {
            context.save();
            document.fonts.ready.then(() => {
                context.fillStyle = this.color;
                context.font = this.fontSize + 'px myFont';
                //game over
                if (this.game.gameOver && !this.game.pause) {
                    this.game.letters = [];
                    this.game.enemies = [];
                    context.fillText('Collected Letters:', canvas.width*.3, canvas.height*.5);
                    if (letterWave < 1850) {
                        for (let i = 0; i < 26; ++i) {
                            if (game.lettersCollected[i]) {
                                if (context.globalAlpha === 0.2) context.globalAlpha = 1;
                                context.fillText(String.fromCharCode(65+i), canvas.width+i*70-(letterWave), canvas.height*.65 + Math.sin(((canvas.width+i*70-(letterWave)*.025))+i)*18); //50*i, canvas.height*.65);
                            }
                            else {
                                if (context.globalAlpha === 1) context.globalAlpha = 0.2;
                                context.fillText(String.fromCharCode(65+i), canvas.width+i*70-(letterWave), canvas.height*.65 + Math.sin(((canvas.width+i*70-(letterWave))*.025)+i)*18); //50*i, canvas.height*.65);
                            }
                            letterWave += globalTime*.01;
                        }
                    }
                    else {
                        for (let i = 0; i < 26; ++i) {
                            if (game.lettersCollected[i]) {
                                if (context.globalAlpha === 0.2) context.globalAlpha = 1;
                                context.fillText("" + String.fromCharCode(65+i), canvas.width+i*70-(letterWave), canvas.height*.65 + Math.sin(((canvas.width+i*70-(letterWave-letterWaveExtra)*.025))+i)*18); //50*i, canvas.height*.65);
                            }
                            else {
                                if (context.globalAlpha === 1) context.globalAlpha = 0.2;
                                context.fillText(String.fromCharCode(65+i), canvas.width+i*70-(letterWave), canvas.height*.65 + Math.sin(((canvas.width+i*70-(letterWave-letterWaveExtra))*.025)+i)*18); //50*i, canvas.height*.65);
                            }
                            letterWaveExtra += globalTime*0.01;
                            if (letterWaveExtra >= 1850) letterWaveExtra = 0;
                        }
                    }
                }
                //level
                else context.fillText('Level: ' + (this.game.level+1), canvas.width*.77, canvas.height*.87);
                //score
                if (context.globalAlpha === 0.2) context.globalAlpha = 1;
                context.fillText('Score: ' + this.game.score, canvas.width*.77, canvas.height*.95);
            });
            context.restore();
        }
    }

    class SoundController {
        constructor() {
            this.alarmSound = document.getElementById('alarm');
            this.deathSound = document.getElementById('death');
            this.backgroundSound = document.getElementById('background');
        }
        alarm() {
            this.alarmSoundTime = 0;
            this.alarmSound.play();
        }
        death() {
            this.deathSoundTime = 0;
            this.deathSound.play();
        }
        background() {
            this.backgroundSoundTime = 0;
            this.backgroundSound.play();
        }
    }

    //main game play
    class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.player = new Player(this);
            this.input = new InputHandler(this);
            this.ui = new UI(this);
            this.sound = new SoundController();
            this.keys = [];
            this.enemies = [];
            this.letters = [];
            this.gameOver = false;
            this.score = 0;
            this.lettersCount = 0;
            this.lettersCaught = 0;
            this.lettersCollected = [false, false, false, false, false, false, false, false, false, false, false, false, false,
                                    false, false, false, false, false, false, false, false, false, false, false, false, false];
            this.level = 0;
            this.nextLevel = true;
            this.pause = false;
            this.delayLevel = 0;// this.level;
            this.delayLevelShow = false;
        }
        
        update(deltaTime){
            this.sound.background();
            globalTime = deltaTime;
            //pause game until press spacebar again
            if (!Menu) {
                //pause game 1 second
                if (this.pause) {
                    let now = Date.now(), 
                    end = now + 1000; 
                    while (now < end) { now = Date.now(); }
                    this.pause = false;
                }
                
                //remove shark sprites marked for deletion
                this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);
                
                //remove letter sprites marked for deletion
                this.letters = this.letters.filter(letter => !letter.markedForDeletion);

                //show score and then show level after level is loaded
                if (this.delayLevelShow) {
                    this.level = this.delayLevel;
                    this.delayLevelShow = false;
                }
                
                //if current level is complete and not game over go to next level
                if (this.nextLevel) {
                    this.letters = [];
                    this.enemies = []; 
                    //completed
                    if (this.level === 0) {
                        this.lettersCount = 1;
                        this.addEnemy(canvas.width, sharkHei);
                        this.addLetters(0, canvas.width+sharkWid*0.5, sharkHei+24, true);
                    }
                    //completed
                    if (this.level === 1) {
                        this.lettersCount = 1;
                        this.addEnemy(canvas.width, 96);
                        this.addEnemy(canvas.width, sharkHei*2*Math.floor(Math.random()*2));
                        this.addLetters(1, canvas.width+sharkWid*1.5, sharkHei+24, true);
                    }
                    //completed
                    if (this.level === 2) {
                        this.lettersCount = 1;
                        this.addEnemy(canvas.width, 0);
                        this.addEnemy(canvas.width, sharkHei*1);
                        this.addEnemy(canvas.width, sharkHei*3);
                        this.addLetters(2, canvas.width+sharkWid, sharkHei*2+24, true);
                    }
                    //completed
                    if (this.level === 3) {
                        this.lettersCount = 1;
                        this.addEnemy(canvas.width-sharkWid/2, sharkHei*4);
                        this.addEnemy(canvas.width, sharkHei*5);
                        this.addEnemy(canvas.width+sharkWid/2, sharkHei*6);
                        this.addLetters(3, canvas.width+sharkWid*1.5, sharkHei*5+24, true);
                    }
                    //completed
                    if (this.level === 4) {
                        this.lettersCount = 1;
                        this.addEnemy(canvas.width-sharkWid*1.5, sharkHei*5);
                        this.addEnemy(canvas.width+sharkWid*1.5, sharkHei*5);
                        this.addLetters(4, canvas.width+sharkWid, sharkHei*5+24, true);
                    }
                    //completed
                    if (this.level === 5) {
                        this.lettersCount = 1;
                        this.addEnemy(canvas.width, sharkHei*8);
                        this.addEnemy(canvas.width-sharkWid, sharkHei*9);
                        this.addEnemy(canvas.width+sharkWid, sharkHei*9);
                        this.addEnemy(canvas.width-sharkWid*2, sharkHei*10);
                        this.addEnemy(canvas.width, sharkHei*10);
                        this.addEnemy(canvas.width+sharkWid*2, sharkHei*10);
                        this.addLetters(5, canvas.width+sharkWid*2, sharkHei*9+24, true);
                    }
                    //completed
                    if (this.level === 6) {
                        this.lettersCount = 1;
                        this.addEnemy(canvas.width-sharkWid*3, sharkHei*5);
                        this.addEnemy(canvas.width, sharkHei*5);
                        this.addEnemy(canvas.width+sharkWid*3, sharkHei*5);
                        this.addLetters(6, canvas.width+sharkWid*1.75, sharkHei*5+24, true);
                    }
                    //completed
                    if (this.level === 7) {
                        this.lettersCount = 2;
                        this.addEnemy(canvas.width, sharkHei*5);
                        this.addEnemy(canvas.width+sharkWid*3, sharkHei*5);
                        this.addEnemy(canvas.width+sharkWid*0.5, sharkHei*6);
                        this.addEnemy(canvas.width+sharkWid*0.5+sharkWid*3, sharkHei*6);
                        this.addLetters(7, canvas.width+sharkWid*2, sharkHei*5+24, false);
                        this.addLetters(8, canvas.width+sharkWid*2+sharkHei*0.5, sharkHei*6+24, true);
                    }
                    //completed
                    if (this.level === 8) {
                        this.lettersCount = 2;
                        this.addEnemy(canvas.width, sharkHei*4);
                        this.addEnemy(canvas.width+sharkWid*3, sharkHei*4);
                        this.addEnemy(canvas.width+sharkWid*0.5, sharkHei*5);
                        this.addEnemy(canvas.width+sharkWid*0.5+sharkWid*3, sharkHei*5);
                        this.addEnemy(canvas.width+sharkWid*1, sharkHei*6);
                        this.addEnemy(canvas.width+sharkWid*3+sharkWid*3, sharkHei*6);
                        this.addLetters(9, canvas.width+sharkWid*2, sharkHei*5+24, false);
                        this.addLetters(10, canvas.width+sharkWid*3, sharkHei*5+24, true);
                    }
                    //completed
                    if (this.level === 9) {
                        this.lettersCount = 2;
                        this.addEnemy(canvas.width+sharkWid*5+sharkWid*0.5, sharkHei*1);
                        this.addEnemy(canvas.width, sharkHei*2);
                        this.addEnemy(canvas.width+sharkWid*3, sharkHei*2);
                        this.addEnemy(canvas.width+sharkWid*5, sharkHei*2);
                        this.addEnemy(canvas.width+sharkWid*5-sharkWid*0.5, sharkHei*3);
                        this.addLetters(11, canvas.width+sharkWid, 24, false);
                        this.addLetters(12, canvas.width+sharkWid*4, sharkHei*2+24, true);
                    }
                    //completed
                    if (this.level === 10) {
                        this.lettersCount = 2;
                        this.addEnemy(canvas.width, sharkHei*5);
                        this.addEnemy(canvas.width+sharkWid*2.5, sharkHei*5);
                        this.addEnemy(canvas.width, sharkHei*6);
                        this.addEnemy(canvas.width+sharkWid*2.5, sharkHei*7);
                        this.addEnemy(canvas.width, sharkHei*8);
                        this.addEnemy(canvas.width+sharkWid*2.5, sharkHei*8);
                        this.addLetters(13, canvas.width+sharkWid, sharkHei*7+24, false);
                        this.addLetters(14, canvas.width+sharkWid+sharkWid*1.25, sharkHei*6+24, true);
                    }
                    //completed - maybe make letters 15 and 16 canvas.width+sharkWid*1.375 if too hard
                    if (this.level === 11) {
                        this.lettersCount = 2;
                        this.addEnemy(canvas.width, sharkHei*4);
                        this.addEnemy(canvas.width, sharkHei*5);
                        this.addEnemy(canvas.width, sharkHei*6);
                        this.addLetters(15, canvas.width+sharkWid*1.25, sharkHei*4+24, false);
                        this.addLetters(16, canvas.width+sharkWid*1.25, sharkHei*5+24, true);
                    }
                    //completed - ugly may need to change x position of letters
                    if (this.level === 12) {
                        this.lettersCount = 3;
                        this.addEnemy(canvas.width+sharkWid*2.5, sharkHei*1);
                        this.addEnemy(canvas.width, sharkHei*2);
                        this.addEnemy(canvas.width+sharkWid*5, sharkHei*2);
                        this.addLetters(17, canvas.width+sharkWid*1.375, sharkHei+24, false);
                        this.addLetters(18, canvas.width+sharkWid*2.375, sharkHei*2+24, false);
                        this.addLetters(19, canvas.width+sharkWid*3.375, sharkHei+24, true);
                    } 
                    //completed - ugly and maybe too easy so maybe need to change x position of letters
                    if (this.level === 13) {
                        this.lettersCount = 3;
                        this.addEnemy(canvas.width, sharkHei*4);
                        this.addEnemy(canvas.width+sharkWid*2.75, sharkHei*4);
                        this.addEnemy(canvas.width+sharkWid*5.5, sharkHei*4);
                        this.addLetters(20, canvas.width+sharkWid*1.75, sharkHei*4+24, false);
                        this.addLetters(21, canvas.width+sharkWid*3.125, sharkHei*4+24, false);
                        this.addLetters(22, canvas.width+sharkWid*4.5, sharkHei*4+24, true);
                    } 
                    //completed
                    if (this.level === 14) {
                        this.lettersCount = 3;
                        this.addEnemy(canvas.width+sharkWid*3.75, sharkHei*7);
                        this.addEnemy(canvas.width+sharkWid*0.5, sharkHei*8);
                        this.addEnemy(canvas.width, sharkHei*9);
                        this.addLetters(23, canvas.width+sharkWid*1.625, sharkHei*8+24, false);
                        this.addLetters(24, canvas.width+sharkWid*2.625, sharkHei*6+24, false);
                        this.addLetters(25, canvas.width+sharkWid*3.625, sharkHei*8+24, true);
                    }
                    //game over
                    if (this.level === 15) {

                    }
                    this.repeatCount = 0;
                    this.lettersCaught = 0;
                    this.nextLevel = false;
                }

                //update player and make sure he is in bounds
                this.player.update(deltaTime);
                if (this.player.y < 0) this.player.y = 0;
                if (this.player.y > (canvas.height - this.player.height)) this.player.y = canvas.height - this.player.height;

                //update sharks
                this.enemies.forEach(enemy => {
                    enemy.update(deltaTime);
                    //diver collision with shark and pause game before going to game over
                    if (this.checkCollision(this.player, enemy)) {
                        this.sound.death();
                        enemy.markedForDeletion = true; this.gameOver = true; this.level = 15; this.pause = true;
                    }
                    //shark open mouth at 150px to diver else relaxed mouth
                    if (this.checkAttack(this.player, enemy)) {
                        if (!enemy.alarmSound) {
                            enemy.alarmSound = true;
                            this.sound.alarm();
                        }
                        enemy.open = true;
                    }
                    else {
                        enemy.open = false;
                        enemy.alarmSound = false;
                    }
                });

                //update letters
                this.letters.forEach(letter => {
                    letter.update(deltaTime);
                    //player collision with letter
                    if (this.checkCollision(this.player, letter)) {
                        this.score += letter.score;
                        this.lettersCaught++;
                        this.lettersCollected[letter.index] = true;
                        letter.markedForDeletion = true;
                        //if collect all letters in current wave add bonus 
                        if (this.lettersCaught === this.lettersCount) {
                            this.score += letter.score*this.lettersCount;
                            this.pause = true;
                            this.delayLevelShow = true;
                            this.delayLevel++;  
                            this.nextLevel = true;
                            if (this.delayLevel === 15) this.gameOver = true;
                        }
                        //if collect last letter pause game before going to next level or end screen
                        /*if (letter.index ) {
                            this.pause = true;
                            this.delayLevelShow = true;
                            this.delayLevel++;  
                            this.nextLevel = true;
                        }*/
                    }
                });

                // if all letters have passed or collect last letter go to next level
                if ( (this.letters === undefined || this.letters.length === 0) && this.level < 15) {
                    this.delayLevelShow = true;
                    this.delayLevel++;
                    this.nextLevel = true;
                    if (this.delayLevel === 15) this.gameOver = true;
                }

                //go to 1st level
                if (restart) {
                    this.level = 0;
                    this.delayLevel = 0;
                    this.score = 0;
                    //maybe change letters collected to 0 here as well
                    this.nextLevel = true;
                    this.gameOver = false;
                    restart = false;
                }
                //go to next level
                if (skipLevel) {
                    this.level++;
                    this.delayLevel++;
                    this.nextLevel = true;
                    if (this.level === 15) this.gameOver = true;
                    skipLevel = false;
                }
            }
            else {
                grid.style.display = "flex";                
            }
        }

        draw(context){
            this.player.draw(context);
            this.ui.draw(context);
            this.enemies.forEach(enemy => {
                enemy.draw(context);
            })
            this.letters.forEach(letter => {
                letter.draw(context);
            })
        }

        addEnemy(xStart, yStart) {
            this.enemies.push(new Shark(this, xStart, yStart));
        }

        addLetters(index, xStart, yStart, last) {
            this.letters.push(new Letter(this, index, xStart, yStart, last));
        }

        checkCollision(rect1, rect2) {
            return (
                rect1.x < rect2.x + rect2.width &&
                rect1.x + rect1.width > rect2.x &&
                rect1.y < rect2.y + rect2.height &&
                rect1.height + rect1.y > rect2.y 
            )
        }

        checkAttack(rect1, rect2) {
            return (
                rect1.x < rect2.x + rect2.width + 100 &&
                rect1.x + rect1.width + 150 > rect2.x &&
                rect1.y < rect2.y + rect2.height &&
                rect1.height + rect1.y > rect2.y  
            )
        }
    }

    const game = new Game(canvas.width, canvas.height);
    let lastTime = 0;
    // animation loop
    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update(deltaTime);
        game.draw(ctx);
        requestAnimationFrame(animate);
    }
    animate(0);
});