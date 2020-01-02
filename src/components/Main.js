import * as p5 from 'p5';
import * as _ from 'lodash';
import {Particles} from './Particles.js';
import {LavaLamp} from './LavaLamp.js';

let particles;
const NUM_PARTICLES = 2;
let lamp = new LavaLamp({width: 300, height: 300, x: 50, y: 75});
new p5();// Make p5 functions global;

let drawLamp = function() {
    fill('rgb(137,236,255)');
    lamp.draw();
    lamp.minX(50);
    lamp.minX(100);
    lamp.minX(150);
    lamp.minX(250);

    lamp.maxX(50);
    lamp.maxX(100);
    lamp.maxX(150);
    lamp.maxX(250);
}
let s = (sk) => {   
    sk.setup = () => {
        createCanvas(400, 800);
        
        console.log({lamp});
        
        // return;
        noStroke();
        particles = new Particles();
        fill('rgb(71,217,246)');
        // for (let i=0;i<NUM_PARTICLES;i++) {
        //     // continue;
        //     let x = Math.round(Math.random()*400);
        //     let y = Math.round(Math.random()*400);
        //     let r = 60;
        //     particles.add({x,y,r});
        // }
        particles.add({x: 200,y:75,r:60});
        particles.add({x: 200,y:380,r:60});

        particles.add({x: 200,y:75,r:100});
        // particles.add({x: 200,y:310,r:25});
        particles.add({x: 200,y:380,r:130});
        particles.calculateMaxSpreads();
    }

    sk.draw = function () {
        // return;
        clear();
        drawLamp();
        fill('rgb(71,217,246)');
        // noStroke();
        // p2.vector.x = mouseX;
        // p2.vector.y = mouseY;
        for (let i=0;i<NUM_PARTICLES;i++) {
            particles.particles[i].move(lamp);
        }
        particles.draw();
        particles.calculateMaxSpreads();
        lamp.drawOverlay();
    }
}

async function Main() {
    const P5 = new p5(s);
}

export default Main;