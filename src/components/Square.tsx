"use client"

import useNodeStore from "@/store/NodeStore";
import { useCallback, useEffect, useRef, useState } from "react";
import { Handle, NodeProps, NodeResizer, Position, useNodeId, useNodesState } from "reactflow";

import 'reactflow/dist/style.css';

import { blue } from "tailwindcss/colors";


const Square = ({ selected, data, id, xPos, yPos }: NodeProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const nodes = useNodeStore((state) => state.nodes)
    const [isEditing, setIsEditing] = useState(true);
    const [editedLabel, setEditedLabel] = useState(data.label);

    const updateNodeText = useNodeStore((state) => state.updateNodeText)
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
        <div id={id} className="flex justify-center items-center font-medium  bg-emerald-300 rounded w-full h-full min-w-[200px] min-h-[200px]" onDoubleClick={handleDoubleClick} onDragEnd={() => console.log("dropped")}>
            {isEditing ? (
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Add text"
                    value={editedLabel}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    autoFocus
                    className="bg-transparent border-none outline-none  cursor-text text-center placeholder:text-gray-700"
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