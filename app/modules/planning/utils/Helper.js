import VecN from '/math/VecN';
import Heap from '/algorithm/Heap';

function lineChecker(temp1) {
    return function checkLine(sampler, start, end, step, knownDistance, lerpTo) {
        if (step === undefined) step = 1;

        if (knownDistance === undefined) knownDistance = VecN.dist(start, end);

        var inters = true;
        var inc = step / knownDistance;
        for (var i = inc; i < 1; i += inc) {
            lerpTo(temp1, start, end, i);
            if (sampler(temp1)) {
                inters = false;
                break;
            }
        }
        return !inters || sampler(end);
    }
}


function randomDotInBox(nbox, dot, dims) {
    for (var i = 0; i < dims; i++) {
        dot[i] = Math.random() * nbox.width(i) + nbox.min[i];
    }
    return dot;
}

function identity(x) {
    return x;
}

function pathToRoot(parentMap, aNode, costFn, mapperFn) {
    var parentFn = parentMap;
    if (typeof parentMap !== 'function') {
        parentFn = function(item) {
            return parentMap.get(item)
        };
    }
    if (mapperFn === undefined) mapperFn = identity;
    var p = aNode;
    if (p) {
        var path = [];
        var totalLength = 0;
        for(;;) {
            path.unshift(mapperFn(p));
            var parent = parentFn(p);
            if (!parent) break;
            totalLength += costFn(p, parent);
            p = parent;
        }
        return {
            cost: totalLength,
            path: path
        };
    } else {
        return null;
    }
}

function fnOrMap(fnOrMap) {
    return typeof(fnOrMap) === 'function'
      ? fnOrMap
      : key => fnOrMap.get(key);
}

function dijkstra(startNode, endNode, neighboursMap, distFn) {
    var item;
    var queue = new Heap();
    var parentMap = new Map();
    queue.push(0, [null, startNode]);

    while (item = queue.pop()) {
        var current = item.value[1];
        if (!parentMap.has(current)) {
            parentMap.set(current, item.value[0]);
            if (current === endNode) {
                break;
            } else {
                var total = item.key;
                if (!item) break;

                neighboursMap.get(current).forEach(neigh => {
                    var dist = distFn(current, neigh);
                    queue.push(total + dist, [current, neigh]);
                });
            }
        }
    }
    return parentMap;
}

function iterate(self, fn, trialCount) {
    if (trialCount === undefined) trialCount = 20;
    for (var i = 0; i < trialCount && (!self.hasSolution || self.continueForever); i++) {
        fn();
    }
}

export default {
    lineChecker,
    randomDotInBox,
    pathToRoot,
    iterate,
    fnOrMap,
    dijkstra
};