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
    let win = new Map<string, string>().set("X", "C").set("Z", "B").set("Y", "A");
    let cost = new Map().set("X", 1).set("Y", 2).set("Z", 3).set("A", 1).set("B", 2).set("C", 3);
    let totalScore = 0;
    content.forEach(line =>{
        let his, my : string;
        [his, my] = line.split(' ');
        if (cost.get(my) === cost.get(his)) {
            totalScore += 3
        } else if (win.get(my) === his){
            totalScore += 6
        }
        totalScore += cost.get(my);
    });
    console.log(totalScore);
}

const content = read(process.argv.slice(2)[0]);
solve(content);
