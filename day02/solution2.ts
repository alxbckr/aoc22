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
    let win = new Map<string, string>().set("A", "C").set("B", "A").set("C", "B");
    let counter = new Map<string, string>().set("C", "A").set("A", "B").set("B", "C");
    let cost = new Map().set("A", 1).set("B", 2).set("C", 3);
    let totalScore = 0;
    content.forEach(line =>{
        let his, res, my  : string;
        my = "";
        [his, res] = line.split(' ');
        switch(res){
            case 'X': my = win.get(his)!; break;
            case 'Y': my = his; break;
            case 'Z': my = counter.get(his)!; break;
        }
        console.log(my);
        if (my === his) {
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
