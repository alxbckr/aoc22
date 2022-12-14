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
}

function coord2Num(x : number, y : number, len : number) : number {
    return y * len + x;
}

function solve(content: string[]){    
    
    let elems: Array<number>[] = [];
    let graph: Graph = {adj : []};
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
        });
        elems.push(row);
    });

    for (let y = 0; y < elems.length; y++){
        for (let x = 0; x < len; x++) {
            if (elems[y][x] === "S".charCodeAt(0)) start = coord2Num(x,y,len);
            if (elems[y][x] === "E".charCodeAt(0)) end = coord2Num(x,y,len);
            if (x < len-1 && Math.abs(elems[y][x+1] - elems[y][x]) === 1 ) graph.adj[coord2Num(x,y,len)].push(coord2Num(x+1,y,len));
            if (x > 0 && Math.abs(elems[y][x-1] - elems[y][x]) === 1) graph.adj[coord2Num(x,y,len)].push(coord2Num(x-1,y,len));
            if (y < content.length - 1 && Math.abs(elems[y+1][x] - elems[y][x]) === 1) graph.adj[coord2Num(x,y,len)].push(coord2Num(x,y+1,len));
            if (y > 0 && Math.abs(elems[y-1][x] - elems[y][x]) === 1) graph.adj[coord2Num(x,y,len)].push(coord2Num(x,y-1,len));
        }
    }

    console.log(start, end);
    console.log(graph);

    let q : number[] = [];
    visited[0] = true;
    q.push(0);
    while(q.length > 0){
        const v = q.shift();
        if (!v) break;
        graph.adj[v].forEach(a=>{
            if (!visited[a]){
                visited[a] = true;
                q.push(a);
            }
        });
    }
}

const content = read(process.argv.slice(2)[0]);
solve(content);
