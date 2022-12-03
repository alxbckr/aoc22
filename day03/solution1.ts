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
    content.forEach(rucksack =>{
        let items: string[] = [];
        rucksack.slice(0,rucksack.length / 2).split('').forEach(c =>{
            if (rucksack.slice(rucksack.length / 2).includes(c) && !items.includes(c)){
                items.push(c)
                prio += c.charCodeAt(0) >= 97 ? c.charCodeAt(0) - 96 : c.charCodeAt(0) - 38;
            }
        })
    });
    console.log(prio);
}

const content = read(process.argv.slice(2)[0]);
solve(content);
