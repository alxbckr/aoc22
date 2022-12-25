import { group } from 'console';
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

type Graph = {
    adj: Array<number>[];    
    dist: Array<number>;    
}

function coord2Num(x : number, y : number, len : number) : number {
    return y * len + x;
}

function num2Coord(i: number, len : number) {
    return {x : i % len, y: Math.floor(i / len)};
}

function printGraph(visited: boolean[], len : number, elems: Array<number>[]){    
    let line = "";
    let prevC = num2Coord(0, len);
    for (let i = 0; i < visited.length;i++){
        let c = num2Coord(i,len);
        if (c.y !== prevC.y) {
            console.log(line);
            line = "";
        }
        if (visited[i]) line += String.fromCharCode(elems[c.y][c.x])
        else line += "."         
        prevC = c
    }
    console.log(line);
}

function solve(content: string[]){    
    
    let elems: Array<number>[] = [];
    let graph: Graph = {adj : [], dist : []};
    let visited: boolean[] = [];
    let len : number = content[0].length;
    let start = 0;
    let end = 0;

    content.forEach((c)=>{
        let row: number[] = [];
        c.split("").forEach((el)=>{
            row.push(el.charCodeAt(0));
            visited.push(false);
            graph.adj.push([]);
            graph.dist.push(0);
        });
        elems.push(row);
    });

    for (let y = 0; y < elems.length; y++){
        for (let x = 0; x < len; x++) {
            if (elems[y][x] === "S".charCodeAt(0)) {
                elems[y][x] = "a".charCodeAt(0) - 1;
                start = coord2Num(x,y,len);
            }
            if (elems[y][x] === "E".charCodeAt(0)) {
                end = coord2Num(x,y,len);
                elems[y][x] = "z".charCodeAt(0) + 1;
            }
        }
    }

    for (let y = 0; y < elems.length; y++){
        for (let x = 0; x < len; x++) {
            if (x < len-1 && elems[y][x+1] - elems[y][x] <= 1) graph.adj[coord2Num(x,y,len)].push(coord2Num(x+1,y,len));
            if (x > 0 && elems[y][x-1] - elems[y][x] <=1) graph.adj[coord2Num(x,y,len)].push(coord2Num(x-1,y,len));
            if (y < content.length - 1 && elems[y+1][x] - elems[y][x] <= 1) graph.adj[coord2Num(x,y,len)].push(coord2Num(x,y+1,len));
            if (y > 0 && elems[y-1][x] - elems[y][x] <= 1) graph.adj[coord2Num(x,y,len)].push(coord2Num(x,y-1,len));
        }
    }

    console.log(start, end);

    let distance = 0;
    let q : number[] = [];
    visited[start] = true;
    q.push(start);
    while(q.length > 0){
        const v = q.shift();
        if (v === undefined || v === end) break;
        graph.adj[v].forEach(a=>{
            if (!visited[a]){
                visited[a] = true;
                q.push(a);
                graph.dist[a] = graph.dist[v] + 1;
            }
        });           
    }
    printGraph(visited, len, elems);
    console.log(graph.dist[end]);
}

const content = read(process.argv.slice(2)[0]);
solve(content);
