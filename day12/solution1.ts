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

function solve(content: string[]){    

    let graph: Graph = {adj : []};

    let visited: boolean[] = [];
    for (let i = 0; i < content.length; i++){
        visited.push(false);
    }

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
