import { UUID } from "crypto";
import { Node, XYPosition } from "reactflow";
import { current } from "tailwindcss/colors";
import { create, useStore } from "zustand";

export interface NodeState {
  nodes: Node[];
  addNode: (node: Node) => void;
  updateNodePosition: (nodeId: UUID, position: XYPosition) => void;
}

const INITIAL_NODES = [
  {
    id: crypto.randomUUID(),
    position: { x: 200, y: 400 },
    data: { label: "1" },
    type: "square",
  },
  {
    id: crypto.randomUUID(),
    position: { x: 1000, y: 400 },
    data: { label: "2" },
    type: "square",
  },
] satisfies Node[];

const useNodeStore = create<NodeState>()((set) => ({
  nodes: INITIAL_NODES,
  addNode: (node) => set((state) => ({ nodes: [...state.nodes, node] })),
  updateNodePosition: (nodeId, position) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId ? { ...node, position } : node
      ),
    })),
}));

export default useNodeStore;
