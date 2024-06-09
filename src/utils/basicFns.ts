// includes thin wrappers for Lodash functions and any other third party libraries. This allows version upgrades or swapping out libraries to be handled in one place.

import { clone as _clone } from "lodash";

export const clone: typeof _clone = <T>(obj: T) => {
    return clone(obj);
};
