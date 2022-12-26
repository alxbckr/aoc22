import { group } from 'console';
import * as fs from 'fs';
import { listenerCount } from 'process';

type List = {    
    type : string;
    items : Array<List>
    value : number;
} | null;

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

function parseList(inp : string[], idx: number) : {list: List, idx: number} {
    let res : List = { type:'list', items: [], value: 0 };
    let num = "";
    let currItem : List = null; 
    let i = idx;
    while (i < inp.length){
        switch(inp[i]){
            case "[":
                ({list: currItem, idx: i} = parseList(inp, i+1));
                break;
            case "]":
                if (currItem) res.items.push(currItem);
                return {list: res, idx: i};
            case ",":
                num = "";
                if (currItem) res.items.push(currItem);
                currItem = { type:'val', items: [], value: 0 }; 
                break;
            default:
                if (!currItem) currItem = { type:'val', items: [], value: 0 }; 
                num += inp[i];
                currItem.value = parseInt(num);
                break;
        }
        i++;
    };
    return {list: res, idx: i};
}

function convertValToList(val: List) : List {
    return {type: 'list', items: [val], value : 0 };
}

function listToStr(val: List) : string {
    if (!val) return "[]";
    if (val.type === "val" ) return val.value.toString();
    else {
        let str = "[";
        val.items.forEach((it,i)=>{
            str += listToStr(it);
            if (i < val.items.length-1) str += ",";
        })
        return str + "]";        
    }
    return "??";
}

function compareLists(left : List, right: List) : boolean{
    if (!left) return true;
    if (!right) return false;
    for (let i = 0; i < left.items.length; i++){
        if (i >= right.items.length) return false;
        if (left.items[i]?.type === 'val' && right.items[i]?.type === 'val') {
            let lv = left.items[i]!.value;
            let rv = right.items[i]!.value;
            console.log("comparing values ", lv, rv );
            if (lv !== null && rv !== null && lv > rv) return false;
            else if (lv !== null && rv !== null &&  lv < rv) return true;
            else continue;
        } else if (left.items[i]?.type === 'list' && right.items[i]?.type === 'list') {
            console.log("comparing lists",listToStr(left.items[i]),"vs", listToStr(right.items[i]));
            if (compareLists(left.items[i], right.items[i])) return true;
            else return false;
        } else if (left.items[i]?.type === 'list' && right.items[i]?.type === 'val') {
            console.log("comparing list to value", listToStr(left.items[i]), "vs", listToStr(right.items[i]));
            if (compareLists(left.items[i], convertValToList(right.items[i]))) return true;
            else return false;
        } else if (left.items[i]?.type === 'val' && right.items[i]?.type === 'list') {
            console.log("comparing value to list", listToStr(left.items[i]), "vs", listToStr(right.items[i]));
            if (compareLists(convertValToList(left.items[i]), right.items[i])) return true;
            else return false;
        }         
    }
    return true;
}

function solve(content: string[]){    
    let answer : number = 0;
    for (let i = 0; i < content.length / 3; i++){
    //for (let i = 0; i < 1; i++){
        console.log("===")
        let left = content[i*3];
        let right = content[i*3+1];
        let {list: leftList} = parseList(left.split(""),1);
        let {list: rightList} = parseList(right.split(""),1);
        if (compareLists(leftList,rightList)){
            answer += i+1;
        }
    }
    console.log(answer);
}

const content = read(process.argv.slice(2)[0]);
solve(content);
