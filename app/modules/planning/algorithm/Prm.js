
import NBox from '/math/NBox';
import NBoxTree from '/math/NBoxTree';
import Helper from '/planning/utils/Helper';
import UnionFind from '/algorithm/UnionFind';
import MultiMap from '/algorithm/MultiMap';


const FINE_TUNING_COEFF = 20;

function Prm(map) {
    var self = this;



    var dims = map.nbox.dims();
    var boxTree = new NBoxTree(map.nbox);
    var resolution = map.resolution;
    // Use hypersphere 4 times the volume of the resolution sphere
    var connectResolution = FINE_TUNING_COEFF * resolution * Math.pow(4, 1.0 / dims);

    const Configuration = map.Configuration;
    var connectedSets = new UnionFind();
    var neighboursMap = new MultiMap();
    var edges = [];
    var samples = [];

    var startNode = Configuration.copy(map.target);
    var endNode = Configuration.copy(map.start);
    const lastPut = Configuration.create();
    const checkLine = Helper.lineChecker(Configuration.create());


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

        Configuration.copyTo(lastPut, dot);

        boxTree.enumerateInRange(dot, connectResolution, function(dotInTree, knownDistance2) {
            var dist = Math.sqrt(knownDistance2);
            var hitsWall = checkLine(map.sampler, dot, dotInTree, 1, dist, Configuration.lerpTo);
            if (!hitsWall) {
                makeNeighbours(dot, dotInTree);
            }
        });
    }


    function putRandomDot() {
        var newDot = Configuration.create();
        Configuration.randomize(newDot, map.nbox);
        self.samplesGenerated++;
        var nearest = boxTree.nearest(newDot);
        var goodSample = false;
        if (nearest) {
            var knownDistance = Configuration.dist(nearest, newDot);
            if (knownDistance > resolution) {
                if (!map.sampler(newDot)) {
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
        var parentMap = Helper.dijkstra(startNode, endNode, neighboursMap, Configuration.dist);
        return Helper.pathToRoot(parentMap, endNode, Configuration.dist);
    }

    this.samplesGenerated = 0;
    this.hasSolution = false;
    this.continueForever = false;
    this.wrongSampleCallback = null;
    this.edges = edges;
    this.samples = samples;
    this.iterate = iterate;
    this.lastPut = lastPut;
    this.getSolution = getSolution;
}
export default Prm;
