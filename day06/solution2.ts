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
    content.forEach(c=>{
        let b: string[] = [];
        let idx = 0
        c.split('').every((ch,i)=>{
            if (b.length<=13) {
                b.push(ch);
                return true;
            }
            if (b.every((m,i)=>{return b.indexOf(m) === i;})){
                idx = i;
                return false;
            }            
            b.shift();
            b.push(ch);
            return true;
        }); 
        console.log(idx);
    });
}

const content = read(process.argv.slice(2)[0]);
solve(content);
