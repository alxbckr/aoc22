import * as fs from 'fs';

function read(filename: string): string[] {
    let content: string;
    let res: string[] = [];
    try{
        content = fs.readFileSync(`${process.cwd()}/${filename}`,'utf-8');
    } catch(e){
        console.log(e);
        process.exit(9);
    }
    content.split(/\r?\n/).forEach(line =>  {
            res.push(line);
        });
    return res;
}

type Point = {
    x: number;
    y: number;
}

function follow(cH : Point, cT: Point){
    let dx = cH.x - cT.x;
    let dy = cH.y - cT.y;
    if (Math.abs(dx) === 2 && dy === 0) cT.x += dx - 1 * Math.sign(dx);
    else if (Math.abs(dy) === 2 && dx === 0) cT.y += dy - 1 * Math.sign(dy);
    else if (Math.abs(dx) > 0 && Math.abs(dy) > 0){
        if (Math.abs(dx) > Math.abs(dy)) {
            cT.x += dx - 1 * Math.sign(dx);
            cT.y += dy;
        } else if (Math.abs(dx) < Math.abs(dy)){
            cT.y += dy - 1 * Math.sign(dy);
            cT.x += dx;
        } else {
            cT.x += dx - 1 * Math.sign(dx);
            cT.y += dy - 1 * Math.sign(dy);
        }
    }
}

function move(rope: Array<Point>, dx: number, dy: number, visited: Set<string>){
    rope[0].x += dx;
    rope[0].y += dy;
    for(let i = 1; i < rope.length; i++)
        follow(rope[i-1], rope[i]);
    visited.add(JSON.stringify(rope[9]));
    //visualize(10,rope);
}

function visualize(size: number, rope: Array<Point>){
    for (let i = 0; i < size; i++){
        let s = "";
        for (let j = 0; j < size; j++) {
            let x = rope.findIndex(x=>x.x === j && x.y === i);
            if (x >= 0) s+= x;
            else s += '.'; 
        }
        console.log(s)
    }
    console.log()
}

function solve(content: string[]){    
    let cH : Point = {x: 0, y: 0};
    let cT : Point = {x: 0, y: 0};
    let visited: Set<string> = new Set();
    let rope: Array<Point> = [];
    
    for (let i=0; i<10; i++) rope.push({x: 0, y: 0});
    visited.add(JSON.stringify({x: 0, y: 0}));

    content.forEach(c=>{
        let dx = 0, dy = 0;
        let [dir,num] = c.split(' ');
        switch(dir){
            case 'R': dx = 1; break;
            case 'L': dx = -1; break;
            case 'U': dy = 1; break;
            case 'D': dy = -1; break;
        }
        for (let i = 0; i < Number(num); i++) move(rope, dx, dy, visited);
    });
    console.log(visited.size);
}

const content = read(process.argv.slice(2)[0]);
solve(content);
