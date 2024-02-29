"use client"

import React, { useCallback, useEffect, useState } from 'react'

import ReactFlow, { Background, Connection, ConnectionMode, Controls, Node, addEdge, useEdgesState, useNodeId, useNodesState } from 'reactflow';

import 'reactflow/dist/style.css';

//tailwind
import { zinc } from "tailwindcss/colors"
import Square from './Square';
import DefaultEdge from './DefaultEdge';
import useNodeStore from '@/store/NodeStore';


const NODE_TYPES = {
    square: Square
}
const EDGE_TYPES = {
    default: DefaultEdge
}

const ReactFlowCanvas = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });


    const handleMouseMove = (event) => {
        setMousePosition({ x: event.clientX, y: event.clientY });
    };

    const nodesStore: Node[] = useNodeStore((state) => state.nodes)
    const updateNodePosition = useNodeStore((state) => state.updateNodePosition)

    // update node position
    const handleNodePosition = (nodes: Node[]) => {
        console.log(nodes)
    }


    const [edges, setEdges, onEdgesChange] = useEdgesState([])
    const [nodes, setNodes, onNodesChange] = useNodesState(nodesStore)

    useEffect(() => {
        setNodes(nodesStore)
        console.log(nodesStore)
    }, [nodesStore])

    const onConnect = useCallback((connection: Connection) => {
        return setEdges(edges => addEdge(connection, edges))
    }, [])

    const isCreatingNode = useNodeStore((state) => state.isCreatingNode)

    return (
        <ReactFlow
            nodeTypes={NODE_TYPES}
            nodes={nodes}
            connectionMode={ConnectionMode.Loose}
            edges={edges}
            onEdgesChange={onEdgesChange}
            edgeTypes={EDGE_TYPES}
            defaultEdgeOptions={{ type: "default" }}
            onConnect={onConnect}
            onNodesChange={onNodesChange}
            onNodeDragStop={(e) => handleNodePosition(nodes)}
            className='bg-zinc-50 cursor-crosshair'
            onMouseMove={handleMouseMove}
        >
            {isCreatingNode && (
                <div
                    className='bg-emerald-400/20 rounded  min-w-[200px] min-h-[200px]'
                    style={{
                        position: 'absolute',
                        left: mousePosition.x - 8, // Adjust the offset as needed
                        top: mousePosition.y - 8, // Adjust the offset as neededty
                        pointerEvents: 'none', // Allow clicks to pass through
                        zIndex: 1, // Ensure it's above the background
                    }}
                />
            )}

            <Background
                gap={12}
                size={2}
                color={zinc[200]}
            />
            <Controls />
        </ReactFlow>

    )
}

export default ReactFlowCanvas