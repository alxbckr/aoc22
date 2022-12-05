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
    let towers: string[][] = []
    let towersIdx = content[content.indexOf('')-1].match(/\d+/g);
    if (!towersIdx) return;
    towersIdx.forEach(t => {towers.push([])});

    for(let i = content.indexOf('')-2;i>=0;i--){
        let p = content[i].match(/.{1,4}/g);
        if (!p) continue;
        for (let j = 0; j<towers.length;j++){
            if (p[j][1] != ' ') towers[j].push(p[j][1]);
        }
    }

    for(let i: number = content.indexOf('')+1;i<content.length;i++){
        //move N from x to y
        let instr = content[i].match(/\d+/g);
        if (!instr) return;
        let n = parseInt(instr[0]);
        towers[parseInt(instr[2])-1].push(...towers[parseInt(instr[1])-1].splice(-n,n));
    }    
    let answer = '';
    towers.forEach(t=>{answer += t[t.length-1]});
    console.log(answer);
}

const content = read(process.argv.slice(2)[0]);
solve(content);
