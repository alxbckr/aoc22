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
    id1: number,
    cost1: number,
    time1: number,
    id2: number,
    cost2: number,
    time2: number,
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
    
    let ps : Path = { id1: valvesNameMap.get('AA')!, cost1:0, time1: 0,
                      id2: valvesNameMap.get('AA')!, cost2:0, time2: 0,
                      opened: new Map()
                    }
    pq.push(ps)

    while (pq.length > 0) {

        if (pq.length % 1000 === 0) console.log(pq.length)

        const p = pq.shift()
        if (!p) break;
        let hasOpened = false

        let bestClosed = getBestClosed(p,graph)
        while (bestClosed.length > 0) {
            let newPath : Path = {cost1: p.cost1, time1: p.time1, id1: p.id1, 
                                  cost2: p.cost2, time2: p.time2, id2: p.id2, 
                                  opened: new Map(p.opened)}

            let n = bestClosed.shift()
            if (!n) break;

            // one with more time wins
            if (p.time1 + shortestPaths[p.id1][n].time < p.time2 + shortestPaths[p.id2][n].time) {
                const time = p.time1 + shortestPaths[p.id1][n].time + 1
                if (time > 26){
                    continue;
                }
                newPath.id1 = n
                newPath.cost1 += graph.nodes[n].rate * (26 - time)
                newPath.time1 = time 
            }
            else {
                const time = p.time2 + shortestPaths[p.id2][n].time + 1
                if (time > 26){
                    continue;
                }
                newPath.id2 = n
                newPath.cost2 += graph.nodes[n].rate * (26 - time)
                newPath.time2 = time 
            }
            hasOpened = true
            newPath.opened.set(n,true)
            if ( newPath.time1 >= 25 && newPath.time2 >= 25) solved.push(newPath)
            else pq.push(newPath)
        }
        if (!hasOpened) 
            solved.push(p)
    }    

    solved.sort((a,b)=>(b.cost1+b.cost2-a.cost1-a.cost2))    

    for (let i = 0; i < 1; i++){
        console.log(solved[i].cost1+solved[i].cost2)
        console.log(solved[i])
    }
}

const content = read(process.argv.slice(2)[0]);
solve(content);
