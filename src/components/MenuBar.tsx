"use client"

import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarShortcut,
    MenubarTrigger,
} from "@/components/ui/menubar"
import useNodeStore from "@/store/NodeStore"
import { stat } from "fs";
import { useEffect, useState } from "react";
import { getNodesBounds } from "reactflow";


const MenuBar = () => {
    // const [isCreatingNode, setIsCreatingNode] = useState(false);

    const addNode = useNodeStore((state) => state.addNode)
    const isCreatingNode = useNodeStore((state) => state.isCreatingNode)
    const activeIsCreatingNode = useNodeStore((state) => state.activeIsCreatingNode)
    const disableIsCreatingNode = useNodeStore((state) => state.disableIsCreatingNode)

    const handleCanvasClick = (event: any) => {
        if (isCreatingNode) {
            const { offsetX, offsetY, clientX, clientY } = event;
            // console.log({offsetX, offsetY})
            // console.log(clientX, clientY)
            addNode({
                id: crypto.randomUUID(),
                position: { x: offsetX, y: offsetY },
                data: { label: "" },
                type: "square",
            });

            disableIsCreatingNode(); // Disable node creation mode after placing the node
        }
    };

    // Add an event listener for canvas click events
    useEffect(() => {
        document.addEventListener('click', handleCanvasClick);
        return () => {
            document.removeEventListener('click', handleCanvasClick);
        };
    }, [isCreatingNode]);


    return (
        <Menubar className='fixed bottom-20 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-lg px-8 h-28 w-96 overflow-hidden'>
            <MenubarMenu>
                <MenubarTrigger onClick={() => activeIsCreatingNode()} className={`w-28 h-28 bg-emerald-500 mt-6 rounded  transition-transform cursor-pointer hover:-translate-y-2`}>add node</MenubarTrigger>
            </MenubarMenu>
        </Menubar>
    )
}



export default MenuBar