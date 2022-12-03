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

function solve(content: string[]){
    let prio = 0
    let gs = Array.from(
        new Array(Math.ceil(content.length / 3)),
        (_, i) => content.slice(i * 3, i * 3 + 3));
    
    gs.forEach(g => { 
        let found: string[] = [];
        g[0].split('').forEach(c =>{
            if (g[1].includes(c) && g[2].includes(c) && !found.includes(c)){
                found.push(c);
                prio += c.charCodeAt(0) >= 97 ? c.charCodeAt(0) - 96 : c.charCodeAt(0) - 38;    
            }
        });
    });
    console.log(prio);
}

const content = read(process.argv.slice(2)[0]);
solve(content);
