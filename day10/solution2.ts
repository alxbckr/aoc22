import { CallTracker } from 'assert';
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

function draw(crt: string[][], cycle: number, sprite: number){
    let y = Math.floor(( cycle - 1) / 40);
    let x = (cycle - 1) % 40;
    if (x >= sprite-1 && x <= sprite+1) crt[y][x] = '#';
    else crt[y][x] = '.';
}

function solve(content: string[]){    
    let regX = 1;
    let op = "";
    let arg = "";
    let len = 0;
    let pos = 0;
    let measureCycle = 20;
   
    let crt : string[][] = [];
    let sprite = 1;

    for (let i = 0; i < 6; i++) {
        let c : string[] = [];
        for (let j = 0; j < 40; j++) c.push("");
        crt.push(c);
    }

    for (let cycle = 1; cycle <= 240; cycle++){
        draw(crt, cycle, sprite);

        if (op === ""){
            [op, arg] = content[pos].split(' '); 
            pos++;
            switch(op){
                case "noop": len = 1; break;
                case "addx": len = 2; break;
            }            
        } 

        if (op !== ""){
            len--;
            if (len === 0) {
                if (arg) {
                    regX += Number(arg);
                    sprite = regX;
                }
                op = "";
            }
        }     
    }
    crt.forEach(c=>console.log(c.join("")));
}

const content = read(process.argv.slice(2)[0]);
solve(content);
