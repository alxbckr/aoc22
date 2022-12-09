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
        line.forEach((m,j)=>{ if (i===0 || j === 0 || i === content.length-1 || j === line.length - 1) v.push(1); else v.push(0);});
        trees.push(line);
        visible.push(v);
    });

    let answer = 0;

    // row visibility
    for (let i = 1; i < trees.length-1;i++){
        let max = trees[i][0];
        for (let j = 1; j < trees[i].length-1;j++){            
            if (trees[i][j] > max) { visible[i][j] = 1; max = trees[i][j]; } 
        }
        max = trees[i][trees[i].length-1];
        for (let j = trees[i].length-2; j > 0;j--){
            if (trees[i][j] > max) { visible[i][j] = 1; max = trees[i][j] } 
        }
    }

    //column visibility
    for (let j = 1; j < trees[0].length-1;j++) {
        let max = trees[0][j];
        for (let i = 1; i < trees.length-1;i++){
            if (trees[i][j] > max) { visible[i][j] = 1; max = trees[i][j] }  
        }
        max = trees[trees.length-1][j];
        for (let i = trees.length-2; i > 0 ;i--){
            if (trees[i][j] > max) { visible[i][j] = 1; max = trees[i][j] }  
        }
    }    
    visible.forEach(v=>{
        v.forEach(k=>{if (k>0) answer++});
    });
    console.log(answer);
}

const content = read(process.argv.slice(2)[0]);
solve(content);
