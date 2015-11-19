const MapClass = Map;

export default class MultiMap {
    constructor() {
        this._map = new MapClass();
    }
    put(key, value) {
        const myMap = this._map;
        var mySet = myMap.get(key);
        if (!mySet) {
            mySet = new Set();
            myMap.set(key, mySet);
        }
        mySet.add(value);
        return mySet;
    }
    get(key) {
        return this._map.get(key) || [];
    }
}
