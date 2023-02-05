import * as fs from 'fs';
import { Context } from 'vm';

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

function generateRadiusPoints(a: Coord, dist: number) : Array<Coord> {
    let res : Array<Coord> = [];    
    let x = a.x-dist; 
    let y = a.y
    while (x <= a.x + dist) {       
        res.push({x: x, y: y});
        x++;
        if (x <= a.x) y--;
        else y++;
    }
    x = a.x-dist+1; 
    y = a.y+1
    while (x <= a.x + dist-1) {       
        res.push({x: x, y: y});
        x++;
        if (x <= a.x) y++;
        else y--;
    }    
    return res;
}

function solve(content: string[]){    
    let pairs: Array<Pair> = [];
    let minX = Number.MAX_SAFE_INTEGER, maxX = Number.MIN_SAFE_INTEGER;
    content.forEach(c=>{
        let [s,b] = c.replace("Sensor at x=","").replace(": closest beacon is at x=", "/").replaceAll("y=","").split("/");
        let [xs,ys] = s.split(",").map(Number);
        let [xb,yb] = b.split(",").map(Number);
        pairs.push({sensor: {x:xs, y:ys}, beacon: {x: xb,y: yb}})
    });
        
    let c : Coord = {x:0,y:0};
    pairs.forEach(p=>{
        let points = generateRadiusPoints(p.sensor,calcManhattanDist(p.sensor,p.beacon)+1);
        points.every(point=>{
            if (point.x > 4000000 || point.x < 0 || point.y > 4000000 || point.y < 0 ) return false;
            let found = true;
            pairs.forEach(pc=>{
                if (calcManhattanDist(pc.sensor,pc.beacon) >= calcManhattanDist(pc.sensor,point)) found = false;
            })
            if (found) { c = point; return false; }
            return true;
        })
    })
    console.log(c);
}

const content = read(process.argv.slice(2)[0]);
solve(content);
