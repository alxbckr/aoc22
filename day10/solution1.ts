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
    let regX = 1;
    let op = "";
    let arg = "";
    let len = 0;
    let pos = 0;
    let measureCycle = 20;
    let answer = 0;
    for (let cycle = 1; cycle <= 220; cycle++){
        
        if (op !== ""){
            len--;
            if (len === 0) {
                if (arg) regX += Number(arg);
                op = "";
            }
        }
        
        if (cycle === measureCycle){
            answer += cycle * regX;
            measureCycle += 40;
        }

        if (op === ""){
            [op, arg] = content[pos].split(' '); 
            pos++;
            switch(op){
                case "noop": len = 1; break;
                case "addx": len = 2; break;
            }            
        } 
    }
    console.log(answer);
}

const content = read(process.argv.slice(2)[0]);
solve(content);
