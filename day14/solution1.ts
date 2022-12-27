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

type Cave = Array<Array<Number>>;

type Coord = {
    x: number,
    y: number
}

function buildWalls(cave: Cave, coords: Coord[]) : Cave{
    let prev = coords[0];
    for (let i = 1; i < coords.length; i++){
        let dx = 0, dy = 0;
        if (prev.x === coords[i].x) dy = Math.sign(coords[i].y - prev.y);
        if (prev.y === coords[i].y) dx = Math.sign(coords[i].x - prev.x);
        for (let x = prev.x; x !== coords[i].x; x+=dx) cave[prev.y][x] = 1;
        for (let y = prev.y; y !== coords[i].y; y+=dy) cave[y][prev.x] = 1;
        cave[coords[i].y][coords[i].x] = 1;
        prev = coords[i];
    }
    return cave;
}

function printCave(cave: Cave) {
    let maxX = 0, maxY = 0, minX = Number.MAX_SAFE_INTEGER, minY = Number.MAX_SAFE_INTEGER

    cave.forEach((row,y)=>{
        row.forEach((cell,x)=>{
            if (cell !== 0){
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
                if (y < minY) minY = y;
                if (y > maxY) maxY = y;                
            }
        })
    })
    
    console.clear();
    for (let y = minY; y <= maxY; y++){
        let str = "";
        for (let x = minX; x <= maxX; x++){
            switch(cave[y][x]){
                case 0: str += "."; break;
                case 1: str += "#"; break;
                default: str += "o"; break;
            }
        }
        console.log(str);
    }
}

function moveSand(sand: Coord, cave: Cave) : number {
    if (sand.y+1 >= 200) return -1;
    if (cave[sand.y+1][sand.x] === 0) {
        sand.y += 1;
        return 1;
    }
    if (cave[sand.y+1][sand.x-1] === 0) {
        sand.y += 1;
        sand.x -= 1;
        return 1;
    }
    if (cave[sand.y+1][sand.x+1] === 0) {
        sand.y += 1;
        sand.x += 1;
        return 1;
    }
    cave[sand.y][sand.x] = 2;
    return 0;
}

function solve(content: string[]){    
    
    let cave : Cave = [];
    for (let y = 0; y < 200; y++) cave.push(Array(1000).fill(0));

    content.forEach(c=>{
        let coords : Coord[] = [];
        c.split(" -> ").forEach(comp=>{
            let coord : Coord = {x:0,y:0};
            [coord.x,coord.y] = comp.split(",").map(Number);
            coords.push(coord);
        })
        cave = buildWalls(cave, coords);
    })

    let sand : Coord = {x:500, y: 0}
    let sandUnits = 1;
    let res = 0;
    while (res >= 0){
        res = moveSand(sand, cave);
        if (res === 0) { sand = {x:500, y: 0}; sandUnits++;}
    }
    printCave(cave);
    console.log(sandUnits-1);
}

const content = read(process.argv.slice(2)[0]);
solve(content);
