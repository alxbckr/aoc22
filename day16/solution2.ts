import { time } from 'console';
import * as fs from 'fs';

type Node = {
    id: number,
    name: string,
    rate: number,
}

type Graph = {
    nodes: Array<Node>,
    sortedNodes: Array<Node>,
    adj: Array<Array<number>>;    
}

type Dist = {
    id: number,
    time: number,
    between: Array<number>,
}

type PathItem = {
    id: number,
    cost: number,
    time: number,
    //opened: Array<number>
}

type Path = {
    items: Array<PathItem>
    opened: Map<number,boolean>,    
}

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

function getBestClosed(p: Path, g: Graph) : Array<number> {
    let res : Array<number> = []
    for (let i=0; i<g.sortedNodes.length; i++){
        if (g.sortedNodes[i].rate !== 0 && !p.opened.has(g.sortedNodes[i].id))
            res.push(g.sortedNodes[i].id)
        if (res.length >= 7) break;
    }
    return res    
}

function solve(content: string[]){    
    
    let graph: Graph = { nodes: [], adj: [], sortedNodes: [] }
    graph.nodes = Array(content.length).fill(null)
    let valvesNameMap : Map<string, number> = new Map()
    let valvesMap : Map<string, string[]> = new Map()

    // Build Graph
    content.forEach((c,idx)=>{
        let p = c.replace('Valve ', '')
                 .replace(' has flow rate=', ' ')
                 .replace('; tunnels lead to valves ', ' ')
                 .replace('; tunnel leads to valve ', ' ')
                 .replaceAll(',', '')

        let [name, rate, ...valves] = p.split(' ');

        graph.nodes[idx] = {id: idx, name: name, rate: Number(rate)}
        valvesNameMap.set(name, idx)
        valvesMap.set(name,valves)
    })

    graph.nodes.forEach((n,idx) => {
        graph.adj.push([])
        graph.adj[idx].push(...Array.from(valvesMap.get(n.name)!, v => {
            return valvesNameMap.get(v)!;
        }))
    })

    graph.sortedNodes = Array.from(graph.nodes)
    graph.sortedNodes.sort((a,b)=>b.rate-a.rate)

    // BFS get shortest distances between nodes
    let shortestPaths: Array<Array<Dist>> = []    

    for (let node of graph.nodes){
        let q : Dist[] = []
        let visited: boolean[] = Array(graph.nodes.length).fill(false);
        
        q.push({id: node.id, time: 0, between: []});
        shortestPaths.push(Array(graph.nodes.length))

        while(q.length > 0){
            const v = q.shift();
            if (!v) break;
            visited[v.id] = true 
            shortestPaths[node.id][v.id] = v
            graph.adj[v.id].forEach(a=>{
                if (!visited[a]){
                    q.push({id: a, time: v.time+1, between: [...Array.from(v.between), v.id] });
                }
            });           
        }
    }

    // start building paths
    let pq: Path[] = []
    let solved: Path[] = []
    
    let ps : Path = { items: [{id: valvesNameMap.get('AA')!, cost:0, time: 0},
                              {id: valvesNameMap.get('AA')!, cost:0, time: 0}],
                      opened: new Map()
                    }
    pq.push(ps)

    while (pq.length > 0) {
        const p = pq.shift()
        if (!p) break;
        let hasOpened = false

        let bestClosed = getBestClosed(p,graph)
        while (bestClosed.length > 0) {
            let newPath : Path = {items: [], opened: new Map(p.opened)}

            let n = bestClosed.shift()
            if (!n) break;

            // one with more time wins
            //newPath.items.push({cost: p.items[0].cost, time: p.items[0].time, id: p.items[0].id, opened: Array.from(p.items[0].opened)})
            //newPath.items.push({cost: p.items[1].cost, time: p.items[1].time, id: p.items[1].id, opened: Array.from(p.items[1].opened)})
            newPath.items.push({cost: p.items[0].cost, time: p.items[0].time, id: p.items[0].id})
            newPath.items.push({cost: p.items[1].cost, time: p.items[1].time, id: p.items[1].id})
            let i = 0
            if (p.items[0].time + shortestPaths[p.items[0].id][n].time > p.items[1].time + shortestPaths[p.items[1].id][n].time ) {
                i = 1
            }

            const time = p.items[i].time + shortestPaths[p.items[i].id][n].time + 1
            if (time > 26){
                continue;
            }

            hasOpened = true
            newPath.opened.set(n,true)
            newPath.items[i].id = n
            newPath.items[i].cost = p.items[i].cost + graph.nodes[n].rate * (26 - time)
            newPath.items[i].time = time 
            // newPath.items[i].opened.push(n)

            pq.push(newPath)
        }
        if (!hasOpened) 
            solved.push(p)
    }    

    solved.sort((a,b)=>(b.items[0].cost + b.items[1].cost-a.items[0].cost-a.items[1].cost))    

    for (let i = 0; i < 1; i++){
        console.log(solved[i].items[0].cost+solved[i].items[1].cost)
        console.log(solved[i].items[0])
        console.log(solved[i].items[1])
        // console.log(Array.from(solved[i].items[0].opened, v => graph.nodes[v].name).join(','))
        // console.log(Array.from(solved[i].items[1].opened, v => graph.nodes[v].name).join(','))
    }
}

const content = read(process.argv.slice(2)[0]);
solve(content);
