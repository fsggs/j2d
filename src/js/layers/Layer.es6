import GroupNode from "nodes/GroupNode";
import BaseNode from "nodes/BaseNode";
import RuntimeException from "exceptions/RuntimeException";

export const LAYER_PREFIX = '__layer$';

export default class Layer extends GroupNode {
    static isSpecial = true; // This fix situation when add Layer in GroupNode.

    _isGlobal = false;

    _registry = [];

    get(key) {
        return this._nodes[`${LAYER_PREFIX}${key}`] || this._nodes[key] || null;
    }

    has(key) {
        return this._nodes[`${LAYER_PREFIX}${key}`] !== undefined || this._nodes[key] !== undefined;
    }

    constructor(guid) {
        super({id: `${LAYER_PREFIX}${guid}`});
        if (guid === 'global') this._isGlobal = true;
    }

    add(node, index) {
        index = index === undefined ? this.count() : this.find('main') + index;
        if (node.instanceOf(Layer) && this._isGlobal) {
            if (this._registry[node.guid] !== undefined) {
                throw new RuntimeException(`Global layer already contain layer with id: "${node.guid}"`);
            }
            this._registry[node.guid] = node;
            this._nodes[node.guid] = node;
            this._nodes.splice(index, 0, node);
            //TODO:: registry of layers
        } else if (node.instanceOf(Layer) && !this._isGlobal) {
            throw RuntimeException('Only global layer has another layer as child.');
        } else if (node.instanceOf(BaseNode) && this._isGlobal) {
            this._nodes[this.find('main')].add(node);
        } else if (node.instanceOf(BaseNode) && !this._isGlobal) {
            super.add(node)
        }
        return this;
    }

    remove(node) {
        if (node.instanceOf(Layer)) {
            delete this._registry[node.guid];
        }
        super.remove(node);
        return this;
    }

    count() {
        return this._nodes.length;
    }

    find(key) {
        let node = this._nodes[`${LAYER_PREFIX}${key}`];
        if (!node) return null;
        return this._nodes.indexOf(node);
    }
}
