export const getUniqueIntGenerator = (start: number = 0) => {
    let counter = start;
    return () => {
        const current = counter;
        counter = counter + 1;
        return current;
    };
};

export const getSequentialKey = (prefix: string = "", suffix: string = "", start: number = 0) => {
    const numberGen = getUniqueIntGenerator(start);

    return () => `${prefix}${numberGen()}${suffix}`;
};
