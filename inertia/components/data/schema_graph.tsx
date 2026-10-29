import { useEffect, useMemo, useState } from 'react'
import { router } from '@inertiajs/react'
import { KeyRound, Link2 } from 'lucide-react'
import {
  Background,
  BackgroundVariant,
  Controls,
  Handle,
  MarkerType,
  MiniMap,
  Position,
  ReactFlow,
  useNodesState,
  type Edge,
  type Node,
  type NodeProps,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import ResourceIcon from '~/components/data/resource_icon'
import { SEARCH_EVENT } from '~/components/global_search'

export type GraphTable = {
  key: string
  label: string
  icon: string
  lane: 'people' | 'knowledge' | 'cases'
  rows: number
  columns: { name: string; type: string; pk: boolean; fk: boolean }[]
}

export type GraphEdge = {
  id: string
  source: string
  target: string
  columns: string[]
  deleteRule: string
}

type TableNodeData = GraphTable & { dim: boolean; focus: boolean; hit: boolean }

/**
 * What happens to child rows when the parent is deleted
 */
export const RULE_COLORS: Record<string, string> = {
  'CASCADE': '#22d3ee',
  'RESTRICT': '#f59e0b',
  'SET NULL': '#94a3b8',
}

/**
 * Lanes left to right; the two busy lanes get two sub-columns each
 */
const LANE_COLUMNS: Record<GraphTable['lane'], number[]> = {
  people: [0],
  knowledge: [340, 640],
  cases: [980, 1280],
}
const HEADER = 46
const ROW = 20
const GAP = 34

function layout(tables: GraphTable[]) {
  const heights: Record<number, number> = {}
  return Object.fromEntries(
    tables.map((table) => {
      // put each table in the shortest sub-column of its lane
      const x = LANE_COLUMNS[table.lane].reduce((best, col) =>
        (heights[col] ?? 0) < (heights[best] ?? 0) ? col : best
      )
      const y = heights[x] ?? 0
      heights[x] = y + HEADER + table.columns.length * ROW + 14 + GAP
      return [table.key, { x, y }]
    })
  )
}

const shortType = (type: string) => type.replace(/\(.*$/, '').replace(' unsigned', '')

function TableNode({ data }: NodeProps<Node<TableNodeData>>) {
  return (
    <div
      className={[
        'c-node',
        `c-node--${data.lane}`,
        data.dim && 'is-dim',
        data.focus && 'is-focus',
        data.hit && 'is-hit',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <Handle type="target" position={Position.Left} id="l-t" />
      <Handle type="source" position={Position.Left} id="l-s" />
      <Handle type="target" position={Position.Right} id="r-t" />
      <Handle type="source" position={Position.Right} id="r-s" />
      <header className="c-node__head">
        <ResourceIcon name={data.icon} size={14} />
        <span className="c-node__name mono">{data.key}</span>
        <span className="c-node__rows mono">{data.rows}</span>
      </header>
      <ul className="c-node__cols">
        {data.columns.map((column) => (
          <li key={column.name} className={column.pk ? 'is-pk' : column.fk ? 'is-fk' : undefined}>
            <span className="c-node__col">
              {column.pk ? <KeyRound size={11} /> : column.fk ? <Link2 size={11} /> : <i />}
              {column.name}
            </span>
            <span className="c-node__type mono">{shortType(column.type)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

const nodeTypes = { table: TableNode }

/**
 * Follow the light/dark toggle, which only changes <html data-theme>
 */
function useTheme() {
  const read = () =>
    (typeof document !== 'undefined' && document.documentElement.dataset.theme === 'dark'
      ? 'dark'
      : 'light') as 'dark' | 'light'
  const [theme, setTheme] = useState(read)
  useEffect(() => {
    const observer = new MutationObserver(() => setTheme(read()))
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })
    return () => observer.disconnect()
  }, [])
  return theme
}

export default function SchemaGraph({
  tables,
  edges,
}: {
  tables: GraphTable[]
  edges: GraphEdge[]
}) {
  const theme = useTheme()
  const positions = useMemo(() => layout(tables), [tables])
  const [hovered, setHovered] = useState<string | null>(null)
  const [hits, setHits] = useState<string[]>([])

  /**
   * Tables that contain the keyword typed in the header search bar
   */
  useEffect(() => {
    const onSearch = (event: Event) => setHits((event as CustomEvent<string[]>).detail)
    window.addEventListener(SEARCH_EVENT, onSearch)
    return () => window.removeEventListener(SEARCH_EVENT, onSearch)
  }, [])

  const neighbours = useMemo(() => {
    if (!hovered) return null
    const keys = new Set([hovered])
    edges.forEach((edge) => {
      if (edge.source === hovered) keys.add(edge.target)
      if (edge.target === hovered) keys.add(edge.source)
    })
    return keys
  }, [hovered, edges])

  const [nodes, setNodes, onNodesChange] = useNodesState<Node<TableNodeData>>(
    tables.map((table) => ({
      id: table.key,
      type: 'table',
      position: positions[table.key],
      data: { ...table, dim: false, focus: false, hit: false },
    }))
  )

  useEffect(() => {
    setNodes((current) =>
      current.map((node) => ({
        ...node,
        data: {
          ...node.data,
          dim: Boolean(neighbours && !neighbours.has(node.id)),
          focus: node.id === hovered,
          hit: hits.includes(node.id),
        },
      }))
    )
  }, [neighbours, hovered, hits, setNodes])

  const flowEdges: Edge[] = useMemo(
    () =>
      edges.map((edge) => {
        const color = RULE_COLORS[edge.deleteRule] ?? RULE_COLORS['SET NULL']
        const from = positions[edge.source].x
        const to = positions[edge.target].x
        const active = hovered === edge.source || hovered === edge.target
        return {
          id: edge.id,
          source: edge.source,
          target: edge.target,
          sourceHandle: to < from ? 'l-s' : 'r-s',
          targetHandle: to > from ? 'l-t' : 'r-t',
          animated: edge.deleteRule === 'CASCADE',
          label: active ? edge.columns.join(' + ') : undefined,
          className: `c-edge ${hovered && !active ? 'is-dim' : ''} ${active ? 'is-active' : ''}`,
          style: { stroke: color, strokeWidth: active ? 2.2 : 1.3 },
          markerEnd: { type: MarkerType.ArrowClosed, color, width: 16, height: 16 },
        }
      }),
    [edges, positions, hovered]
  )

  return (
    <ReactFlow
      nodes={nodes}
      edges={flowEdges}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onNodeMouseEnter={(_, node) => setHovered(node.id)}
      onNodeMouseLeave={() => setHovered(null)}
      onNodeClick={(_, node) => router.visit(`/data/${node.id}`)}
      colorMode={theme}
      fitView
      fitViewOptions={{ padding: 0.08 }}
      minZoom={0.2}
      maxZoom={1.8}
      nodesConnectable={false}
    >
      <Background variant={BackgroundVariant.Dots} gap={22} size={1} />
      <MiniMap pannable zoomable className="c-minimap" />
      <Controls showInteractive={false} />
    </ReactFlow>
  )
}
