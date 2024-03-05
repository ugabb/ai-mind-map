"use client"

import useNodeStore from "@/store/NodeStore";
import { useCallback, useEffect, useRef, useState } from "react";
import { Handle, NodeProps, NodeResizer, Position, useNodeId, useNodesState } from "reactflow";

import { PiArrowCircleDownThin, PiArrowCircleLeftThin, PiArrowCircleRightThin, PiArrowCircleUpThin } from "react-icons/pi";

import 'reactflow/dist/style.css';

import { blue, red } from "tailwindcss/colors";

interface IDirection {
    top: boolean;
    bottom: boolean;
    left: boolean;
    right: boolean;
}

const Square = ({ selected, data, id, xPos, yPos }: NodeProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const nodes = useNodeStore((state) => state.nodes)
    const [isEditing, setIsEditing] = useState(true);
    const [isAddingNode, setIsAddingNode] = useState<IDirection>({
        top: false,
        bottom: false,
        left: false,
        right: false
    });
    const [editedLabel, setEditedLabel] = useState(data.label);

    const updateNodeText = useNodeStore((state) => state.updateNodeText)
    const addNode = useNodeStore((state) => state.addNode)
    const deleteNode = useNodeStore((state) => state.deleteNode)

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
            console.log(isEditing, inputRef.current, selected)
        }
    }, []);

    const handleInputBlur = () => {
        console.log(id, editedLabel)
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

    return (
        <div id={id} className="flex justify-center items-center font-medium relative  bg-emerald-300 rounded w-full h-full min-w-[200px] min-h-[200px]" onDoubleClick={handleDoubleClick} onDragEnd={() => console.log("dropped")}>
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
                        lineClassName="borderblue-400"
                        handleClassName="h-3 w-3 bg-white border-2 rounded border-blue-400"
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
                                onClick={() => addNode({
                                    id: crypto.randomUUID(),
                                    position: { x: xPos + 300, y: yPos },
                                    data: { label: "" },
                                    type: "square",
                                })}
                                className="flex items-center justify-center bg-transparent size-10 -right-10 border-none"
                            >
                                <PiArrowCircleRightThin className="size-12 text-blue-400" />
                            </Handle>
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
                            left: 300, // Adjust the offset as needed
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
                                onClick={() => addNode({
                                    id: crypto.randomUUID(),
                                    position: { x: xPos - 300, y: yPos },
                                    data: { label: "" },
                                    type: "square",
                                })}
                                className="flex items-center justify-center bg-transparent size-10 -left-10 border-none"
                            >
                                <PiArrowCircleLeftThin className="size-12 text-blue-400" />
                            </Handle>
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
                            left: -300, // Adjust the offset as needed
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
                                onClick={() => addNode({
                                    id: crypto.randomUUID(),
                                    position: { x: xPos, y: yPos - 300 },
                                    data: { label: "" },
                                    type: "square",
                                })}
                                className="flex items-center justify-center bg-transparent size-10 -top-10 border-none"
                            >
                                <PiArrowCircleUpThin className="size-12 text-blue-400" />
                            </Handle>
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
                            // left: -300, // Adjust the offset as needed
                            top: -300, // Adjust the offset as neededty
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
                                onClick={() => addNode({
                                    id: crypto.randomUUID(),
                                    position: { x: xPos, y: yPos + 300 },
                                    data: { label: "" },
                                    type: "square",
                                })}
                                className="flex items-center justify-center bg-transparent size-10 -bottom-10 border-none"
                            >
                                <PiArrowCircleDownThin className="size-12 text-blue-400" />
                            </Handle>
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
                            // left: -300, // Adjust the offset as needed
                            top: 300, // Adjust the offset as neededty
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