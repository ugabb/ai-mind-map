"use client"

import React, { useCallback, useEffect, useRef, useState } from 'react'

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
    const [selectedNodeId, setSelectedNodeId] = useState(null); // State to store the selected node ID
    const nodeRef = useRef(null);

    const handleMouseMove = (event: any) => {
        setMousePosition({ x: event.clientX, y: event.clientY });
    };

    const nodesStore: Node[] = useNodeStore((state) => state.nodes)
    const updateNodePosition = useNodeStore((state) => state.updateNodePosition)
    const updateNodes = useNodeStore((state) => state.updateNodes)

    // // update node position
    const handleNodePosition = (event: any, nodes: Node[]) => {

        const selectedNodeId = event.target.getAttribute('id'); // Get the ID of the dragged node
        const xPos = event.target.getAttribute('data-xPos'); // Get the x position of the dragged node
        const yPos = event.target.getAttribute('data-yPos'); // Get the y position of the dragged node
        const nodePosition = { x: xPos, y: yPos }; // Get the mouse position when the node is dropped

        // Update the node's position
        const updatedNodes = nodes.map((node: Node) => {
            if (node.id === selectedNodeId) {
                return {
                    ...node,
                    position: nodePosition
                };
            }
            return node;
        });
        console.log(updatedNodes)
        updateNodes(updatedNodes);
        console.log("Node position updated:", updatedNodes);
    };

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