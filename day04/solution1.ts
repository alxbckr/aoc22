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
    let a = 0
    content.forEach(line =>{
        let [b1, e1] = line.split(',')[0].split('-');
        let [b2, e2] = line.split(',')[1].split('-');
        if (parseInt(b1) >= parseInt(b2) && parseInt(e1) <= parseInt(e2) ||
            parseInt(b2) >= parseInt(b1) && parseInt(e2) <= parseInt(e1)) a++;
    });
    console.log(a);
}

const content = read(process.argv.slice(2)[0]);
solve(content);
