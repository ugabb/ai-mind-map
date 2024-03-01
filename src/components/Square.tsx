"use client"

import useNodeStore from "@/store/NodeStore";
import { useEffect, useRef, useState } from "react";
import { Handle, NodeProps, NodeResizer, Position, useNodeId } from "reactflow";

import 'reactflow/dist/style.css';

import { blue } from "tailwindcss/colors";


const Square = ({ selected, data, id, xPos, yPos }: NodeProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedLabel, setEditedLabel] = useState(data.label);

    const updateNodeText = useNodeStore((state) => state.updateNodeText)

    const handleDoubleClick = () => {
        setIsEditing(true);
    };

    const handleInputChange = (event: any) => {
        setEditedLabel(event.target.value);
    };

    const handleInputBlur = () => {
        console.log(id, editedLabel)
        setIsEditing(false);
        updateNodeText(id, editedLabel)
    };

    useEffect(() => {
        console.log(data.label)
    }, [data.label])

    return (
        <div id={id} className="flex justify-center items-center font-medium  bg-emerald-400 rounded w-full h-full min-w-[200px] min-h-[200px]" onDoubleClick={handleDoubleClick} onDragEnd={() => console.log("dropped")}>
            {isEditing ? (
                <input
                    type="text"
                    value={editedLabel}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    autoFocus
                    className="bg-transparent border-none outline-none  cursor-text text-center"
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