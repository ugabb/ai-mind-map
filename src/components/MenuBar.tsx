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


const MenuBar = () => {
    // const [isCreatingNode, setIsCreatingNode] = useState(false);


    const addNode = useNodeStore((state) => state.addNode)
    const isCreatingNode = useNodeStore((state) => state.isCreatingNode)
    const activeIsCreatingNode = useNodeStore((state) => state.activeIsCreatingNode)
    const disableIsCreatingNode = useNodeStore((state) => state.disableIsCreatingNode)

    const handleCanvasClick = (event: any) => {
        if (isCreatingNode) {
            const { offsetX, offsetY } = event;
            addNode({
                id: crypto.randomUUID(),
                position: { x: offsetX, y: offsetY },
                data: { label: "NEW" },
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
        <Menubar className='fixed bottom-20 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-lg border-zinc-300 px-8 h-28 w-96 overflow-hidden'>
            <MenubarMenu>
                <MenubarTrigger onClick={() => activeIsCreatingNode()} className={`${isCreatingNode
                    ?
                    "cursor-crosshair w-28 h-28 bg-red-500 mt-6 rounded  transition-transform hover:-translate-y-2"
                    :
                    "w-28 h-28 bg-emerald-500 mt-6 rounded  transition-transform cursor-pointer hover:-translate-y-2"
                    } `}>add node</MenubarTrigger>
            </MenubarMenu>
        </Menubar>
    )
}



export default MenuBar