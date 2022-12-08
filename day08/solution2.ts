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

type MapType = { 
    [id: string]: string; 
}

function solve(content: string[]){    
    let trees: number[][] = [];
    let visible: number[][] = [];

    content.forEach((c,i)=>{
        let line = c.split('').map(Number);
        let v: number[] = [];
        line.forEach((m,j)=>{ if (i===0 || j === 0 || i === content.length-1 || j === line.length - 1) v.push(0); else v.push(1);});
        trees.push(line);
        visible.push(v);
    });

    let answer = 0;

    //row visibility
    for (let i = 1; i < trees.length-1;i++){        
        for (let j = 1; j < trees[i].length-1;j++){            
            let distance = 0;
            for (let k = j-1; k >= 0;k--){
                distance++; 
                if (trees[i][k] >= trees[i][j]) break;
            } 
            visible[i][j] *= distance;
            distance = 0;
            for (let k = j+1; k <= trees[i].length-1;k++){
                distance++; 
                if (trees[i][k] >= trees[i][j]) break;
            } 
            visible[i][j] *= distance;
        }
    }

    //column visibility
    for (let j = 1; j < trees[0].length-1;j++) {
        for (let i = 1; i < trees.length-1;i++){
            let distance = 0;
            for (let k = i-1; k >= 0;k--) {
                distance++; 
                if (trees[k][j] >= trees[i][j]) break;
            } 
            visible[i][j] *= distance;
            distance = 0;
            for (let k = i+1; k <= trees.length-1;k++){
                distance++; 
                if (trees[k][j] >= trees[i][j]) break;
            } 
            visible[i][j] *= distance;
        }
    }    
    visible.forEach(v=>{
        v.forEach(k=>{if (k>answer) answer=k});
    });
    console.log(answer);
}

const content = read(process.argv.slice(2)[0]);
solve(content);
