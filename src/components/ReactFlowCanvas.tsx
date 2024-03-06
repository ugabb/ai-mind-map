"use client"

import React, { useCallback, useEffect, useRef, useState } from 'react'

import ReactFlow, { Background, Connection, ConnectionMode, Controls, Edge, MarkerType, Node, addEdge, useEdgesState, useNodeId, useNodesState } from 'reactflow';

import 'reactflow/dist/style.css';

//tailwind
import { zinc } from "tailwindcss/colors"
import Square from './Square';
import DefaultEdge from './DefaultEdge';
import useNodeStore from '@/store/NodeStore';
import MenuBar from './MenuBar';


const NODE_TYPES = {
    square: Square
}
const EDGE_TYPES = {
    default: DefaultEdge
}

const ReactFlowCanvas = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [selectedNodeId, setSelectedNodeId] = useState(null); // State to store the selected node ID
    const nodeRef = useRef(null);

    const handleMouseMove = (event: any) => {
        setMousePosition({ x: event.clientX, y: event.clientY });
    };

    const nodesStore: Node[] = useNodeStore((state) => state.nodes)
    const edgesStore: Edge[] = useNodeStore((state) => state.edges)
    const updateNodePosition = useNodeStore((state) => state.updateNodePosition)
    const updateNodes = useNodeStore((state) => state.updateNodes)

    // // update node position
    const handleNodePosition = (event: any, nodes: Node[]) => {

        const selectedNodeId = event.target.getAttribute('id'); // Get the ID of the dragged node

        // Update the node's position
        const updatedNodes = nodes.map((node: Node) => {
            if (node.id === selectedNodeId) {
                return {
                    ...node,
                    position: node.position
                };
            }
            return node;
        });

        updateNodes(updatedNodes);
    };

    const [edges, setEdges, onEdgesChange] = useEdgesState(edgesStore)
    const [nodes, setNodes, onNodesChange] = useNodesState([])

    useEffect(() => {
        console.log({ nodes })
    }, [nodes])



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
            defaultEdgeOptions={{ type: "default", markerEnd: { type: MarkerType.Arrow, width: 25, height: 25, color: "#d4d4d8" } }}
            onConnect={onConnect}
            onNodesChange={onNodesChange}
            onNodeDragStop={(e) => handleNodePosition(e, nodes)}
            // onMouseUp={(e) => handleNodePosition(e, nodes)}
            className='bg-zinc-50 cursor-crosshair'
            onMouseMove={handleMouseMove}
        >
            {isCreatingNode && (
                <div
                    className='bg-emerald-400/20 rounded  min-w-[200px] min-h-[200px]'
                    style={{
                        position: 'absolute',
                        left: mousePosition?.x - 8, // Adjust the offset as needed
                        top: mousePosition?.y - 8, // Adjust the offset as neededty
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
            <MenuBar setNodes={setNodes} />
        </ReactFlow>

    )
}

export default ReactFlowCanvas