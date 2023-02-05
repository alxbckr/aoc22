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

type Path = {
    id: number,
    cost: number,
    time: number,
    //nodes: Array<number>,
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
        if (res.length >= 10) break;
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
    let ps : Path = {id: valvesNameMap.get('AA')!, cost:0, time: 0, opened: new Map()}
    pq.push(ps)
    while (pq.length > 0) {
        const p = pq.shift()
        if (!p) break;
        let hasOpened = false
        for (const n of getBestClosed(p,graph)) {
            const time = p.time + shortestPaths[p.id][n].time + 1
            if (time > 30) continue;
            hasOpened = true
            let opened = new Map(p.opened)
            opened.set(n,true)
            let cost = p.cost + graph.nodes[n].rate * (30 - time)
            let pn: Path = {id: n, cost: cost, time: time, opened: opened}
            pq.push(pn)
        }
        if (!hasOpened) {
            solved.push(p)
            continue
        }
    }    

    solved.sort((a,b)=>(b.cost-a.cost))    
    console.log(solved[0].cost)
}

const content = read(process.argv.slice(2)[0]);
solve(content);
