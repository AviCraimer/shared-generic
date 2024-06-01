import { TypeEq, Assert } from "./../utilityTypes/typeTesting";
import { traverseDepthFirst } from "./objectTraversal";

type ChildrenTree = {
    order: number;
    children: ChildrenTree[];
};

type ComponentsTree = {
    order: number;
    components: ComponentsTree[];
};

describe("traverseDepthFirst", () => {
    const depthFirstTree: ChildrenTree = {
        order: 6,
        children: [
            {
                order: 4,
                children: [
                    { order: 1, children: [] },
                    { order: 2, children: [] },
                ],
            },
            {
                order: 5,
                children: [{ order: 3, children: [] }],
            },
        ],
    };

    const depthFirstComponentsTree: ComponentsTree = {
        order: 6,
        components: [
            {
                order: 4,
                components: [
                    { order: 1, components: [] },
                    { order: 2, components: [] },
                ],
            },
            {
                order: 5,
                components: [{ order: 3, components: [] }],
            },
        ],
    };

    const depthFirstChildren = traverseDepthFirst("children");
    //Traversal function for "components" key
    const depthFirstComponents = traverseDepthFirst("components");

    // Type level tests
    type InferChildrenTree = Parameters<typeof depthFirstChildren<ChildrenTree>>[0];
    type InferComponentsTree = Parameters<typeof depthFirstComponents<ComponentsTree>>[0];
    type Test1 = Assert<TypeEq<InferChildrenTree, ChildrenTree>>;
    type Test2 = Assert<TypeEq<InferComponentsTree, ComponentsTree>>;

    test("should traverse the tree in depth-first order", () => {
        const traversedNodes: [ChildrenTree, ChildrenTree | undefined][] = [];
        const sideEffect = (node: ChildrenTree, parent: ChildrenTree | undefined) => {
            traversedNodes.push([node, parent]);
        };

        expect(depthFirstChildren(depthFirstTree, sideEffect)).toEqual(traversedNodes);
        expect(traversedNodes.map(([n]) => n.order)).toEqual([1, 2, 3, 4, 5, 6]);

        // Check it works for the tree using the alternative key "components"
        expect(depthFirstComponents(depthFirstComponentsTree)).toEqual([1, 2, 3, 4, 5, 6]);
    });

    test("Correct ParentChild Relationships", () => {
        const parentChildList = depthFirstChildren(depthFirstTree);

        parentChildList.forEach(([node, parent]) => {
            // We exclude the root which has no parent.
            if (node !== depthFirstTree) {
                expect(parent!.children.includes(node)).toBe(true);
            }
        });
    });

    test("works with different children key", () => {});
});
