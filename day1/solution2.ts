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
    let sum = 0;
    let calories: number[] = [];
    content.forEach(line => {
        if (line === "") {
            calories.push(sum);
            sum = 0;
            return;
        }
        sum += parseInt(line);
    })
    calories.push(sum);
    calories.sort((a, b) => {return b-a});
    console.log(calories[0]+calories[1]+calories[2]);
}

const content = read(process.argv.slice(2)[0]);
solve(content);
