const fs = require('fs');

class Chore {
    constructor(chore, points, time) {
        this.chore = chore;
        this.points = points;
        this.time = time;
    }
}

let chores = [];

const first = 153744120;
const last = 155636280;
const day = 8641;
let count = 0;

for (let i = first; i < last; i += day) {
    if (!Boolean(i%2)) {
        chores.push(new Chore('Washing Up', 1, ''+i+'0000'));
        chores.push(new Chore('Putting Away', 1, ''+(i+16)+'0000'));
    }
    if (!Boolean(i%3)) {
        chores.push(new Chore('Cleaning the Surfaces', 1, ''+i+'0000'));
    }
    if (!Boolean(i%10)) {
        chores.push(new Chore('Setting off Laundry', 1, ''+i+'0000'));
        chores.push(new Chore('Taking down Laundry', 1, ''+(i+16)+'0000'));
        chores.push(new Chore('Hanging up Laundry', 1, ''+(i+54)+'0000'));
    }
    if (!Boolean(i%11)) {
        chores.push(new Chore('Vacuuming', 1, ''+i+'0000'));
    }
    if (!Boolean(i%19)) {
        chores.push(new Chore('Cleaning the Hob', 3, ''+i+'0000'));
    }
    count++;
}

console.log(count);
let data = JSON.stringify(chores);
fs.writeFileSync('server/chores.json', data);