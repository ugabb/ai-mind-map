import { UUID } from "crypto";
import { Edge, Node, XYPosition } from "reactflow";
import { current } from "tailwindcss/colors";
import { create, useStore } from "zustand";

export interface NodeState {
  nodes: Node[];
  currentNodePosition: XYPosition;
  addNode: (node: Node) => void;
  updateNodePosition: (nodeId: string, position: XYPosition) => void;
  updateNodes: (nodes: Node[]) => void;
  updateNodeText: (nodeId: string, position: string) => void;
  deleteNode: (nodeId: string) => void;
  isCreatingNode: boolean;
  activeIsCreatingNode: () => void;
  disableIsCreatingNode: () => void;
  nodePosition: (position: XYPosition) => void;

  edges: Edge[];
}

const useNodeStore = create<NodeState>()((set) => ({
  nodes: [],
  currentNodePosition: { x: 0, y: 0 },
  isCreatingNode: false,
  addNode: (newNode) =>
    set((state) => {
      console.log(state.nodes);
      return { nodes: [...state.nodes, newNode] };
    }),
  updateNodes: (nodes: Node[]) =>
    set((state) => ({
      nodes,
    })),
  nodePosition: (position: XYPosition) =>
    set((state) => ({
      currentNodePosition: position,
    })),
  updateNodePosition: (nodeId, position) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId ? { ...node, position } : node
      ),
    })),
  updateNodeText: (nodeId, newText) =>
    set((state) => ({
      nodes: state.nodes.map((node: Node) =>
        node.id === nodeId ? { ...node, data: { label: newText } } : node
      ),
    })),
  deleteNode: (nodeId) =>
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== nodeId),
    })),
  activeIsCreatingNode: () => set((state) => ({ isCreatingNode: true })),
  disableIsCreatingNode: () => set((state) => ({ isCreatingNode: false })),

  edges: [],
}));

export default useNodeStore;
