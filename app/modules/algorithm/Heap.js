function swap(l, i, j) {
    var tmp = l[i];
    l[i] = l[j];
    l[j] = tmp;
}

class KeyValue {
    constructor(key, value) {
        this.key = key;
        this.value = value;
    }
}

export default class Heap {
    constructor() {
        this.list = [];
    }

    push(key, value) {
        const list = this.list;
        var index = list.length, parent = 0;
        var cursor = new KeyValue(key, value);
        list.push(cursor);
        while (index > 0) {
            parent = Math.floor((index - 1) / 2);
            var pitem = list[parent];
            if (cursor.key < pitem.key) {
                list[index] = pitem;
                index = parent;
            } else break;
        }
        list[index] = cursor;
    }

    pop() {
        const list = this.list;
        var result = list[0];
        if (list.length > 1) {
            list[0] = list.pop();
            var length = list.length;
            var index = 0;
            for (; ;) {
                var left = index * 2 + 1;
                var right = left + 1;
                var smallest = index;
                if (left < length && list[left].key < list[smallest].key) {
                    smallest = left;
                }
                if (right < length && list[right].key < list[smallest].key) {
                    smallest = right;
                }
                if (smallest !== index) {
                    swap(list, index, smallest);
                    index = smallest;
                } else {
                    break;
                }
            }
        } else if (list.length > 0) {
            list.length = 0;
        }
        return result;
    }
    peek() {
        return this.list[0];
    }

    has() {
        return this.list.length > 0;
    }
};
