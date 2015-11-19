const { max } = Math;

class UnionFindItem {
    constructor(item) {
        this.parent = null;
        this.height = 1;
        this.item = item;
    }
}

function findRoot(item) {
    var root = item, temp;
    while (root.parent !== null) {
        root = root.parent;
    }
    while (item.parent !== null) {
        temp = item.parent;
        item.parent = root;
        item = temp;
    }
    return root;
}
export default class UnionFind {
    constructor() {
        this.metaMap = new Map();
    }

    _getMeta(item) {
        const metaMap = this.metaMap;
        var meta = metaMap.get(item);
        if (!meta) {
            meta = new UnionFindItem(item);
            metaMap.set(item, meta);
        }
        return meta;
    }

    find(item) {
        return findRoot(this._getMeta(item));
    }

    _unionMeta(meta1, meta2) {
        meta1 = findRoot(meta1);
        meta2 = findRoot(meta2);
        if (meta1 !== meta2) {
            if (meta1.height > meta2.height) {
                meta2.parent = meta1;
            } else {
                meta1.parent = meta2;
                meta1.height = max(meta1.height, meta2.height + 1);
            }
            return true;
        }
        return false;
    }

    union(item1, item2) {
        return this._unionMeta(this._getMeta(item1), this._getMeta(item2));
    }

    same(item1, item2) {
        return this.find(item1) === this.find(item2);
    }
}
