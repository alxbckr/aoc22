import * as fs from 'fs';
import { monitorEventLoopDelay } from 'perf_hooks';
import { StringifyOptions } from 'querystring';

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

type Monkey = {
    items : number[];
    operation : string;
    arg1: string;
    arg2: string;
    test: number;
    monkeyToTrue: number;
    monkeyToFalse: number;
    countItems: number;
};

function newMonkey() : Monkey {
    let m : Monkey = {items: [], operation: "", arg1: "", arg2: "", test: 0, monkeyToTrue:0, monkeyToFalse:0, countItems: 0};
    return m;
}

function calcWorry(i : number, op: string, arg1: string, arg2: string){
    let x = 0, y = 0;
    switch (arg1) {
        case "old": x = i; break;
        default: x = Number(arg1);
    }
    switch (arg2) {
        case "old": y = i; break;
        default: y = Number(arg2);
    }    
    switch(op){
        case '+': return x + y;
        case '-': return x - y;
        case '*': return x * y;
        case '/': return x / y;
    }
    return 0;
}

function solve(content: string[]){    
    let monkeys : Monkey[] = [];
    let monkey = newMonkey();
    content.forEach((c,i)=>{
        switch (i % 7){
            case 0: return; 
            case 1: 
                monkey.items = c.substring(18).split(',').map(Number); break;
            case 2: 
                [monkey.arg1, monkey.operation, monkey.arg2] = c.substring(19).split(" ");
                break;
            case 3: 
                monkey.test = Number(c.substring(21)); 
                break;
            case 4: 
                monkey.monkeyToTrue = Number(c.substring(29)); 
                break;
            case 5: 
                monkey.monkeyToFalse = Number(c.substring(30)); 
                break;
            case 6: 
                monkeys.push(monkey);
                monkey = newMonkey(); 
                return;
        }
    });
    monkeys.push(monkey);
    
    for (let round = 0; round < 20; round++){
        monkeys.forEach((m,mi)=>{
            m.items.forEach(i=>{
                m.countItems++;
                let worry = Math.floor(calcWorry(i, m.operation, m.arg1, m.arg2) / 3);
                if (worry % m.test === 0) monkeys[m.monkeyToTrue].items.push(worry);
                else monkeys[m.monkeyToFalse].items.push(worry);                 
            });
            m.items = [];
        });
    };
    monkeys.sort((a,b)=>{return b.countItems - a.countItems});
    console.log(monkeys[0].countItems * monkeys[1].countItems);
}

const content = read(process.argv.slice(2)[0]);
solve(content);
