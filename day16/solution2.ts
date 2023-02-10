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
    time1: number,
    id2: number,
    time2: number,
    cost: number,
    opened: Map<number,boolean>,    
    openedList1: Array<number>,
    openedList2: Array<number>
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
    if (p.opened.size === g.sortedNodes.length) return []
    let res : Array<number> = []
    for (let i=0; i<g.sortedNodes.length; i++){
        if (!p.opened.has(g.sortedNodes[i].id))
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

    graph.sortedNodes = Array.from(graph.nodes.filter(v=>v.rate > 0))
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
    
    let ps : Path = { id1: valvesNameMap.get('AA')!, cost:0, time1: 0,
                      id2: valvesNameMap.get('AA')!, time2: 0,
                      opened: new Map(),
                      openedList1: [], openedList2: []
                    }
    pq.push(ps)

    let bestPathCost = 0

    while (pq.length > 0) {

        if (pq.length % 1000 === 0) console.log(pq.length)

        const p = pq.shift()
        if (!p) break;
        let hasOpened = false

        let bestClosed = getBestClosed(p,graph)
        while (bestClosed.length > 0) {
            let n = bestClosed.shift()
            if (!n) break;

            let newPath : Path = { cost: p.cost, time1: p.time1, id1: p.id1, 
                                    time2: p.time2, id2: p.id2, 
                                    opened: new Map(p.opened),
                                    openedList1: Array.from(p.openedList1),
                                    openedList2: Array.from(p.openedList2),
                                }
            
            let time = 0                                
            if (p.time1 + shortestPaths[p.id1][n].time <= p.time2 + shortestPaths[p.id2][n].time) {                                    
                time = p.time1 + shortestPaths[p.id1][n].time + 1
                if (time > 26){
                    continue;
                }
                newPath.id1 = n
                newPath.cost += graph.nodes[n].rate * (26 - time)
                newPath.time1 = time 
                newPath.openedList1.push(n)                
            } else {
                time = p.time2 + shortestPaths[p.id2][n].time + 1
                if (time > 26){
                    continue;
                }
                newPath.id2 = n
                newPath.cost += graph.nodes[n].rate * (26 - time)
                newPath.time2 = time 
                newPath.openedList2.push(n)
            }

            // check if it is worth continuing
            if (newPath.cost + bestClosed.reduce((p,c)=>p+graph.nodes[c].rate*(26 - time),0) < bestPathCost)
                continue

            hasOpened = true
            newPath.opened.set(n,true)
            pq.push(newPath)
        }        
        if (!hasOpened){
            solved.push(p)
            if (p.cost > bestPathCost) bestPathCost = p.cost
        } 
    }    

    solved.sort((a,b)=>(b.cost-a.cost))    
    console.log(solved.length)
    for (let i = 0; i < 5; i++){
        console.log(solved[i].cost)
        console.log(solved[i])
        console.log(Array.from(solved[i].openedList1, v => graph.nodes[v].name).join(','))
        console.log(Array.from(solved[i].openedList2, v => graph.nodes[v].name).join(','))
    }
}

const content = read(process.argv.slice(2)[0]);
solve(content);
