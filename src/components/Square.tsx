"use client"

import useNodeStore from "@/store/NodeStore";
import { useCallback, useEffect, useRef, useState } from "react";
import { Connection, Handle, NodeProps, Node, NodeResizer, Position, addEdge, useEdgesState, ResizeParams, useNodesState, useReactFlow } from "reactflow";

import { PiArrowCircleDownThin, PiArrowCircleLeftThin, PiArrowCircleRightThin, PiArrowCircleUpThin } from "react-icons/pi";

import 'reactflow/dist/style.css';

import { blue, red } from "tailwindcss/colors";
import { url } from "inspector";

interface IDirection {
    top: boolean;
    bottom: boolean;
    left: boolean;
    right: boolean;
}

const Square = ({ selected, data, id, xPos, yPos }: NodeProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const nodesStore = useNodeStore((state) => state.nodes)
    const edgesStore = useNodeStore((state) => state.edges)

    const [nodes, setNodes, onNodesChange] = useNodesState(nodesStore)
    const [edges, setEdges, onEdgesChange] = useEdgesState(edgesStore)

    const [isEditing, setIsEditing] = useState(false);
    const [isAddingNode, setIsAddingNode] = useState<IDirection>({
        top: false,
        bottom: false,
        left: false,
        right: false
    });
    const [editedLabel, setEditedLabel] = useState(data.label);

    const updateNodeText = useNodeStore((state) => state.updateNodeText)
    const updateNodes = useNodeStore((state) => state.updateNodes)
    const addNode = useNodeStore((state) => state.addNode)
    const deleteNode = useNodeStore((state) => state.deleteNode)

    const { getNode, addNodes } = useReactFlow()

    // useEffect(() => {
    //     // console.log("isAddingNode", isAddingNode)
    //     console.log("NODESS", nodes)
    // }, [nodes, isAddingNode])

    const nodeAtual = getNode(id)
    const handleAddSideNode = (direction: string) => {


        if (nodeAtual) {
            console.log("NODE ATUAL:", nodeAtual)

            if (direction === "left" || direction === "right") {
                addNodes({
                    id: crypto.randomUUID(),
                    position: {
                        x: nodeAtual.position.x + (direction === "left" ? -nodeAtual.width - 100 : nodeAtual.width + 100), y: nodeAtual.position.y
                    },
                    data: { label: "" },
                    type: "square",
                    width: nodeAtual.width,
                    height: nodeAtual.height,
                    expandParent: true
                })
            } else {
                addNodes({
                    id: crypto.randomUUID(),
                    position: {
                        x: nodeAtual.position.x, y: nodeAtual.position.y + (direction === "top" ? -nodeAtual.height - 100 : nodeAtual.height + 100)
                    },
                    data: { label: "" },
                    type: "square",
                    width: nodeAtual.width,
                    height: nodeAtual.height,
                })
            }


        }
    }

    const handleDoubleClick = () => {
        setIsEditing(true);
        if (inputRef.current) {
            inputRef.current.focus(); // Set focus on the input element when double-clicked
        }
    };

    const handleInputChange = (event: any) => {
        setEditedLabel(event.target.value);
    };

    useEffect(() => {
        // Focus on the input element when isEditing is true
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const handleInputBlur = () => {
        setIsEditing(false);
        updateNodeText(id, editedLabel)
    };

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (selected) {
            if (event.key === "Delete" && id) {
                deleteNode(id)
            }
        }
    }, [selected, id])

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown)
        }
    }, [handleKeyDown])

    // edges
    const onConnect = useCallback((connection: Connection) => {
        return setEdges(edges => addEdge(connection, edges))
    }, [])


    // // update node size
    const handleNodeSize = (params: ResizeParams, nodes: Node[]) => {
        // Update the node's position
        const { width, height } = params;
        const updatedNodes = nodes.map((node: Node) => {
            if (node.id === id) {
                return {
                    ...node,
                    width,
                    height
                }
            }
            return node;
        });
        setNodes(updatedNodes);
        console.log("Node size updated:", updatedNodes);
    };

    return (
        <div id={id} className={`flex justify-center items-center font-medium relative  bg-emerald-300 rounded w-[${nodeAtual?.width}] h-[${nodeAtual?.height}]`} onDoubleClick={handleDoubleClick} style={{ width: nodeAtual?.width as number, height: nodeAtual?.height as number }}>
            {isEditing ? (
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Add text"
                    value={editedLabel}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    autoFocus
                    className="bg-transparent border-none outline-none  cursor-text text-center placeholder:text-gray-700/80"
                />
            ) : (
                <>
                    <NodeResizer
                        minHeight={200}
                        minWidth={200}
                        isVisible={selected}
                        lineClassName="border-blue-400"
                        handleClassName="h-3 w-3 bg-white border-2 rounded border-blue-400"
                        onResizeEnd={(_, params) => handleNodeSize(params, nodes)}
                    />


                    {isAddingNode.right
                        ?
                        (
                            <Handle
                                id="right"
                                type="source"
                                position={Position.Right}

                                onMouseLeave={() => setIsAddingNode(prev => ({
                                    ...prev,
                                    right: false
                                }))}
                                onClick={() => handleAddSideNode("right")}
                                className="flex items-center justify-center bg-transparent size-10 -right-10 border-none"
                                style={{ backgroundImage: `url(./arrow-circle-right.svg)`, backgroundRepeat: "no-repeat", backgroundPosition: "center" }}
                            />
                        )
                        :
                        (
                            <Handle
                                id="right"
                                type="source"
                                position={Position.Right}
                                style={{ background: blue[400], width: "12px", height: "12px", right: "-20px" }}
                                onMouseEnter={() => setIsAddingNode(prev => ({
                                    ...prev,
                                    right: true
                                }))}
                            />
                        )
                    }


                    {isAddingNode.right && <div
                        className='bg-emerald-400/20 rounded  min-w-[200px] min-h-[200px]'
                        style={{
                            position: 'absolute',
                            width: nodeAtual?.width as number,
                            height: nodeAtual?.height as number,
                            right: -nodeAtual?.width as number - 100, // Adjust the offset as needed
                            // top: 5, // Adjust the offset as neededty
                            pointerEvents: 'none', // Allow clicks to pass through
                            zIndex: 1, // Ensure it's above the background
                        }}
                    />}


                    {isAddingNode.left
                        ?
                        (
                            <Handle
                                id="left"
                                type="source"
                                position={Position.Left}
                                onMouseLeave={() => setIsAddingNode((prev) => ({
                                    ...prev,
                                    left: false
                                }))}
                                onClick={() => handleAddSideNode("left")}
                                className="flex items-center justify-center bg-transparent size-10 -left-10 border-none"
                                style={{
                                    backgroundImage: `url(./arrow-circle-left.svg)`, backgroundRepeat: "no-repeat", backgroundPosition: "center",
                                }}
                            />
                        )
                        :
                        (
                            <Handle
                                id="left"
                                type="source"
                                position={Position.Left}
                                style={{ background: blue[400], width: "12px", height: "12px", left: "-20px" }}
                                onMouseEnter={() => setIsAddingNode(
                                    (prev) => ({
                                        ...prev,
                                        left: true
                                    })
                                )}
                            />
                        )
                    }


                    {isAddingNode.left && <div
                        className='bg-emerald-400/20 rounded  min-w-[200px] min-h-[200px]'
                        style={{
                            position: 'absolute',
                            width: nodeAtual?.width as number,
                            height: nodeAtual?.height as number,
                            left: -nodeAtual?.width as number - 100, // Adjust the offset as needed
                            // top: 5, // Adjust the offset as neededty
                            pointerEvents: 'none', // Allow clicks to pass through
                            zIndex: 1, // Ensure it's above the background
                        }}
                    />}


                    {isAddingNode.top
                        ?
                        (
                            <Handle
                                id="top"
                                type="source"
                                position={Position.Top}
                                onMouseLeave={() => setIsAddingNode((prev) => ({
                                    ...prev,
                                    top: false
                                }))}
                                onClick={() => handleAddSideNode("top")}
                                className="flex items-center justify-center bg-transparent size-10 -top-10 border-none"
                                style={{
                                    backgroundImage: `url(./arrow-circle-up.svg)`, backgroundRepeat: "no-repeat", backgroundPosition: "center",
                                }}
                            />
                        )
                        :
                        (
                            <Handle
                                id="top"
                                type="source"
                                position={Position.Top}
                                style={{ background: blue[400], width: "12px", height: "12px", top: "-20px" }}
                                onMouseEnter={() => setIsAddingNode(
                                    (prev) => ({
                                        ...prev,
                                        top: true
                                    })
                                )}
                            />
                        )
                    }

                    {isAddingNode.top && <div
                        className='bg-emerald-400/20 rounded  min-w-[200px] min-h-[200px]'
                        style={{
                            position: 'absolute',
                            width: nodeAtual?.width as number,
                            height: nodeAtual?.height as number,
                            top: -nodeAtual?.height as number - 100, // Adjust the offset as needed
                            // top: 5, // Adjust the offset as neededty
                            pointerEvents: 'none', // Allow clicks to pass through
                            zIndex: 1, // Ensure it's above the background
                        }}
                    />}


                    {isAddingNode.bottom
                        ?
                        (
                            <Handle
                                id="bottom"
                                type="source"
                                position={Position.Bottom}
                                onMouseLeave={() => setIsAddingNode((prev) => ({
                                    ...prev,
                                    bottom: false
                                }))}
                                onClick={() => handleAddSideNode("bottom")}
                                className="flex items-center justify-center bg-transparent size-10 -bottom-10 border-none"
                                style={{
                                    backgroundImage: `url(./arrow-circle-down.svg)`, backgroundRepeat: "no-repeat", backgroundPosition: "center",
                                }}
                            />
                        )
                        :
                        (
                            <Handle
                                id="bottom"
                                type="source"
                                position={Position.Bottom}
                                style={{ background: blue[400], width: "12px", height: "12px", bottom: "-20px" }}
                                onMouseEnter={() => setIsAddingNode(
                                    (prev) => ({
                                        ...prev,
                                        bottom: true
                                    })
                                )}
                            />
                        )
                    }

                    {isAddingNode.bottom && <div
                        className='bg-emerald-400/20 rounded  min-w-[200px] min-h-[200px]'
                        style={{
                            position: 'absolute',
                            width: nodeAtual?.width as number,
                            height: nodeAtual?.height as number,
                            bottom: -nodeAtual?.height as number - 100, // Adjust the offset as needed
                            // top: 5, // Adjust the offset as neededty
                            pointerEvents: 'none', // Allow clicks to pass through
                            zIndex: 1, // Ensure it's above the background
                        }}
                    />}



                    {/* ... (other handles) */}
                    <p className="p-2 break-words text-center">{data.label}</p>
                </>
            )}
            {/* <NodeResizer
                minHeight={200}
                minWidth={200}
                isVisible={selected}
                lineClassName="borderblue-400"
                handleClassName="h-3 w-3 bg-white border-2 rounded border-blue-400"
            />

            <Handle
                id="right"
                type="source"
                position={Position.Right}
                style={{ background: blue[400], width: "12px", height: "12px", right: "-20px" }}
            />
            <Handle
                id="left"
                type="source"
                position={Position.Left}
                style={{ background: blue[400], width: "12px", height: "12px", left: "-20px" }}
            />
            <Handle
                id="top"
                type="source"
                position={Position.Top}
                style={{ background: blue[400], width: "12px", height: "12px", top: "-20px" }}
            />
            <Handle
                id="bottom"
                type="source"
                position={Position.Bottom}
                style={{ background: blue[400], width: "12px", height: "12px", bottom: "-20px" }}
            />
            {data.label} */}
        </div>
    )
}

export default Square

function setEdges(arg0: (edges: any) => import("reactflow").Edge[]): any {
    throw new Error("Function not implemented.");
}
