
import NBox from '/math/NBox';
import NBoxTree from '/math/NBoxTree';
import Helper from '/planning/utils/Helper';
import UnionFind from '/algorithm/UnionFind';
import MultiMap from '/algorithm/MultiMap';

import ConfigCost from '/planning/utils/ConfigCost';


const FINE_TUNING_COEFF = 20;

function Prm(map) {
    var self = this;

    var boxTree = new NBoxTree(map.sampleBounds);

    const Configuration = map.Configuration;
    var connectedSets = new UnionFind();
    var neighboursMap = new MultiMap();
    var edges = [];
    var samples = [];

    var startNode = Configuration.copy(map.target);
    var endNode = Configuration.copy(map.start);
    const conf_trial = Configuration.create();
    const lineChecker = new Helper.LineChecker(Configuration.create());


    putDot(startNode);
    putDot(endNode);

    function makeNeighbours(a, b) {
        neighboursMap.put(a, b);
        neighboursMap.put(b, a);
        connectedSets.union(a, b);
        edges.push([{pos:a}, {pos:b}]);
        if (connectedSets.same(startNode, endNode)) {
            self.hasSolution = true;
        }
    }

    function putDot(dot) {
        boxTree.putDot(dot);
        samples.push({pos:dot});

        Configuration.copyTo(conf_trial, dot);

        boxTree.enumerateInRange(dot, map.connectDistance, function(dotInTree, knownDistance2) {
            var dist = Math.sqrt(knownDistance2);
            var hitsWall = lineChecker.check(map.sampler, dot, dotInTree, map.checkResolution, dist, Configuration.lerpTo);
            if (!hitsWall) {
                makeNeighbours(dot, dotInTree);
            }
        });
    }


    function putRandomDot() {
        var newDot = Configuration.create();
        Configuration.randomize(newDot, map.sampleBounds);
        self.samplesGenerated++;
        var nearest = boxTree.nearest(newDot);
        var goodSample = false;
        if (nearest) {
            var knownDistance = Configuration.dist(nearest, newDot);
            if (knownDistance > map.storeResolutionMax) {
                if (!map.sampler.sample(newDot)) {
                    goodSample = true;
                    putDot(newDot, nearest);
                }
            }
        }
        if (!goodSample && self.wrongSampleCallback) {
            self.wrongSampleCallback(newDot);
        }
    }

    function iterate(trialCount) {
        Helper.iterate(self, putRandomDot, trialCount);
    }

    function getSolution() {
        var parentMap = Helper.dijkstra(endNode, startNode, neighboursMap, Configuration.dist);
        var result = Helper.pathToRoot(parentMap, startNode, () => 0.2, dot => new ConfigCost(dot, 0));
        var result_path = result.path;
        for (var i = 1; i < result_path.length; i++) {
            result_path[i].cost = result_path[i-1].cost + Configuration.dist(result_path[i-1].config, result_path[i].config);
        }
        result.cost = result_path[result_path.length - 1].cost;
        return result;
    }

    this.samplesGenerated = 0;
    this.hasSolution = false;
    this.continueForever = false;
    this.wrongSampleCallback = null;
    this.edges = edges;
    this.samples = samples;
    this.iterate = iterate;
    this.conf_trial = conf_trial;
    this.getSolution = getSolution;
}
export default Prm;
