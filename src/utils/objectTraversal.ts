export const traverseDepthFirst =
    <ChildrenKey extends string>(childrenKey: ChildrenKey) =>
    <T extends { [Key in ChildrenKey]: T[] }>(root: T, sideEffect?: (current: T, parent: T | undefined) => void): [node: T, parentNode: T | undefined][] => {
        type NodeList = [node: T, parentNode: T | undefined][];
        const stack: NodeList = [[root, undefined]];
        const result: NodeList = [];

        // We traverse the tree and return the nodes in depth first order, i.e., we move from child to parent left to right in the result array.
        while (stack.length > 0) {
            // Stack has length > 0 to pop will always produce a result.
            const [currentNode, currentNodeParent] = stack.pop()!;

            // Add to the start of the the array
            result.unshift([currentNode, currentNodeParent]);
            const children = currentNode[childrenKey];
            for (let i = children.length - 1; i >= 0; i--) {
                stack.unshift([children[i], currentNode]);
            }
        }

        if (sideEffect) {
            for (const [node, parentNode] of result) {
                sideEffect(node, parentNode);
            }
        }
        return result;
    };
