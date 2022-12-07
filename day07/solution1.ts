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

type TreeNode = {
    name: string,    
    value: string;
    type: string;
    size?:number;
    parent: TreeNode | null;
    nodes: TreeNode[];
}

function createNode(parentNode: TreeNode|null, name: string, value: string, type: string): TreeNode{
    return {name: name, value: value, type: type, parent: parentNode, nodes: []}
}

function buildTree(content: string[]) : TreeNode{
    let tree : TreeNode|null = createNode(null,"/","","dir");
    let currNode: TreeNode|null = tree;
    content.forEach(c=>{
        if (c.at(0) === '$'){
            let [prefix, command, arg] = c.split(' ');
            switch(command){
                case 'cd':
                    if (arg === '/') {
                    } else if (arg === '..'){
                        currNode = currNode!.parent;
                    } else {
                        let r = currNode!.nodes.find(n=>n.name === arg);
                        if (r) currNode = r;
                    }                    
                    return;
                case 'ls':
                    return;
            }
        } else {
            let[p1, p2] = c.split(' ');
            if (p1 === "dir") {
                currNode?.nodes.push(createNode(currNode, p2,"", p1));
            } else {
                currNode?.nodes.push(createNode(currNode, p2, p1, "file"));
            }
        }
    });
    return tree;
}

function traverse(node: TreeNode, level: number, sizes: [{node:string, size: number}]) {
    let size = 0;
    node.nodes.forEach(f=>{
        if (f.type === "dir") {
            size += traverse(f,level+1, sizes);
        } else {
            size += Number(f.value);
        }
    });
    node.size = size;
    sizes.push({node:node.name, size: size});
    return size;
}

function solve(content: string[]){    
    let tree = buildTree(content);
    let sizes: [{node:string, size: number}] = [{node:"", size:0}];
    traverse(tree,0, sizes);
    let answer = 0;
    sizes.filter(f=>f.size<=100000).forEach(f=> answer += f.size );
    console.log(answer);
}

const content = read(process.argv.slice(2)[0]);
solve(content);
