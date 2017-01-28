import BaseNode from "nodes/BaseNode";
import RuntimeException from "exceptions/RuntimeException";

export default class GroupNode extends BaseNode {
    /** @type {Array.<BaseNode|GroupNode>} */
    _nodes = [];

    constructor(data) {
        super(data);
    }

    get(guid) {
        return this._nodes[guid] || null;
    }

    has(guid) {
        return this._nodes[guid] !== undefined;
    }

    add(node) {
        if (node.isSpecialNode) {
            throw new RuntimeException(`You try add the ${node.constructor.name} to GroupNode, but this not work.`);
        }
        if (node.instanceOf(BaseNode)) {
            this._nodes[node.guid] = node;
            this._nodes.push(node);
        }
        return this;
    }

    remove(node) {
        if (node.instanceOf(BaseNode) && this.has(node.guid)) {
            this._nodes.splice(this._nodes.indexOf(node), 1);
            delete this._nodes[node.guid];
        }
        return this;
    }

    flush() {
        this._nodes.length = 0;
        return this;
    }

    render(context, viewport, layers, data) {
        if (this._nodes.length !== 0) {
            this._nodes.forEach(node => {
                node.render(context, viewport, layers, data);
            });
        }
    }
}
