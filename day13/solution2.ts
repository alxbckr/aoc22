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

function compareLists(left : List, right: List) : number{
    console.log("comparing lists",listToStr(left),"vs", listToStr(right));
    if (!left || left.items.length === 0) { console.log("left is empty"); return 1; };
    if (!right || right.items.length === 0) { console.log("right is empty"); return -1; };
    for (let i = 0; i < left.items.length; i++){
        if (i >= right.items.length) { console.log("right has no more items"); return -1 };
        if (left.items[i]?.type === 'val' && right.items[i]?.type === 'val') {
            let lv = left.items[i]!.value;
            let rv = right.items[i]!.value;
            console.log("comparing values ", lv, rv );
            if (lv !== null && rv !== null && lv > rv) return -1;
            else if (lv !== null && rv !== null &&  lv < rv) return 1;
            else continue;
        } else if (left.items[i]?.type === 'list' && right.items[i]?.type === 'list') {
            console.log("comparing lists",listToStr(left.items[i]),"vs", listToStr(right.items[i]));
            let res = compareLists(left.items[i], right.items[i]);
            if (res != 0) return res;            
        } else if (left.items[i]?.type === 'list' && right.items[i]?.type === 'val') {
            console.log("comparing list to value", listToStr(left.items[i]), "vs", listToStr(right.items[i]));
            let res = compareLists(left.items[i], convertValToList(right.items[i]));
            if (res!=0) return res;
        } else if (left.items[i]?.type === 'val' && right.items[i]?.type === 'list') {
            console.log("comparing value to list", listToStr(left.items[i]), "vs", listToStr(right.items[i]));
            let res = compareLists(convertValToList(left.items[i]), right.items[i]);
            if (res!=0) return res;
        }         
    }
    if (left.items.length < right.items.length) return 1;
    else return 0;
}

function solve(content: string[]){    
    let lists : Array<List> = [];
    for (let i = 0; i < content.length / 3; i++){
        console.log("===")
        let left = content[i*3];
        let right = content[i*3+1];
        let {list: leftList} = parseList(left.split(""),1);
        let {list: rightList} = parseList(right.split(""),1);
        lists.push(leftList);
        lists.push(rightList);
    }    
    let {list: leftList} = parseList("[[2]]".split(""),1);
    let {list: rightList} = parseList("[[6]]".split(""),1);
    lists.push(leftList);
    lists.push(rightList);

    lists.sort((a,b)=>{return compareLists(a,b)*-1});
    let answer = 0;
    let idx1 = 0;
    let idx2 = 0;
    lists.forEach((c,idx)=>{
        if (listToStr(c) === "[[2]]") idx1 = idx+1;
        if (listToStr(c) === "[[6]]") idx2 = idx+1;
        console.log(listToStr(c))
    });
    console.log(idx1*idx2);
}

const content = read(process.argv.slice(2)[0]);
solve(content);
