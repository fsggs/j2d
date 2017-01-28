import CollectionNode from "nodes/CollectionNode";
import UUID from "utils/UUID";

/**
 * @class LayersManager
 * @exports module:core/LayersManager
 *
 * @constructor
 */
export default class LayersManager {
    constructor() {
        /** @type CollectionNode */
        this.globalCollection = new CollectionNode({id: 'GlobalLayer'});

        /** @type Array.<CollectionNode>|CollectionNode[] */
        this.layers = [];

        /** @type number */
        this.index = 1000;
    }

    /**
     * @param {string} name
     * @param {number} [zIndex]
     * @param {CollectionNode|undefined} [node]
     * @returns {LayersManager}
     */
    addLayer(name, zIndex, node) {
        name = name || UUID.generate();

        if (node === undefined || node instanceof CollectionNode) {
            if (zIndex === undefined) {
                zIndex = this.index;
                this.index++;
            } else {
                zIndex += 1000;
            }

            node = node || new CollectionNode({id: name, zIndex: zIndex});

            this.globalCollection.add(node, name);
            this.layers[zIndex] = node;

            return this;
        }
        // throw new InvalidArgumentException('Unknown node type to add as layers');
    }

    /**
     * @param {string} name
     * @returns {LayersManager}
     */
    removeLayer(name) {
        delete this.layers[this.globalCollection.get(name).zIndex];
        this.globalCollection.remove(null, name);
        return this;
    }

    /**
     * @param {string} name
     * @returns {CollectionNode|null}
     */
    getLayer(name) {
        if (this.globalCollection.has(name)) {
            return this.globalCollection.get(name);
        }
        return null;
    }

    /**
     * @param {string} name
     * @param {number} zIndex
     * @returns {LayersManager}
     */
    setZIndex(name, zIndex) {
        if (this.globalCollection.has(name)) {
            delete this.layers[this.globalCollection.get(name).zIndex];
            this.globalCollection.get(name).zIndex = zIndex;
            this.layers[zIndex] = this.globalCollection.get(name);
        }
        return this;
    }
}
