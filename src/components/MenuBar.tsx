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


const MenuBar = () => {

    const addNode = useNodeStore((state) => state.addNode)

    const addSquareNode = () => {
        addNode({
            id: crypto.randomUUID(),
            position: { x: 500, y: 800 },
            data: {label: "NOVO"},
            type: "square",
        },)
    }

    return (
        <Menubar className='fixed bottom-20 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-lg border-zinc-300 px-8 h-28 w-96 overflow-hidden'>
            <MenubarMenu>
                <MenubarTrigger onClick={addSquareNode} className="w-28 h-28 bg-emerald-500 mt-6 rounded  transition-transform cursor-pointer hover:-translate-y-2"></MenubarTrigger>
            </MenubarMenu>
        </Menubar>
    )
}

export default MenuBar