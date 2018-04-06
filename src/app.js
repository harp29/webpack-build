import gsap from 'gsap';

const scss = require('./app.scss');
require('./index.pug');

TweenMax.to(document.querySelector('h1'), 1, {x: 50});

console.log('from app.js wow hash');
