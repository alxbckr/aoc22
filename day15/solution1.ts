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

type Coord = {
    x: number,
    y: number
}

type Pair = {
    sensor: Coord,
    beacon : Coord,
}

function calcManhattanDist(a: Coord, b: Coord) : number{
    return (Math.abs(a.x - b.x)+Math.abs(a.y-b.y));
}

function solve(content: string[]){    
    let pairs: Array<Pair> = [];
    let minX = Number.MAX_SAFE_INTEGER, maxX = Number.MIN_SAFE_INTEGER;
    content.forEach(c=>{
        let [s,b] = c.replace("Sensor at x=","").replace(": closest beacon is at x=", "/").replaceAll("y=","").split("/");
        let [xs,ys] = s.split(",").map(Number);
        let [xb,yb] = b.split(",").map(Number);
        pairs.push({sensor: {x:xs, y:ys}, beacon: {x: xb,y: yb}})
        if (xs + calcManhattanDist({x:xs, y:ys}, {x: xb,y: yb}) > maxX) maxX = xs + calcManhattanDist({x:xs, y:ys}, {x: xb,y: yb});
        if (xs - calcManhattanDist({x:xs, y:ys}, {x: xb,y: yb}) < minX) minX = xs - calcManhattanDist({x:xs, y:ys}, {x: xb,y: yb});
    })   
    //console.log(pairs);
    //console.log(minX, maxX)

    let y = 2000000;
    let pos = 0;
    for (let x = minX; x <= maxX; x++){
        let canNotExist = false;
        if (pairs.some(p=>{return p.beacon.x === x && p.beacon.y === y})) continue;
        pairs.every(p=>{
            if (calcManhattanDist(p.sensor,p.beacon) >= calcManhattanDist(p.sensor,{x: x, y:y})) {
                canNotExist = true;
                return false;                
            }
            return true;
        })
        if (canNotExist) pos++;
    }
    console.log(pos);
}

const content = read(process.argv.slice(2)[0]);
solve(content);
