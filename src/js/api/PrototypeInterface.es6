/**
 * PrototypeInterface
 * @constructor
 */
export default class PrototypeInterface {
    static interfaces = [PrototypeInterface];

    instanceOf(interfaces) {
        let i = 0, j = 0;
        if (typeof interfaces === 'object' && interfaces instanceof Array) {
            for (i = 0; i < interfaces.length; i++) {
                if (typeof interfaces[i] === 'function' && new (interfaces[i]) instanceof PrototypeInterface) {
                    for (j = 0; j < this.constructor.interfaces.length; j++) {
                        if (!(new (this.constructor.interfaces[j]) instanceof interfaces[i])) return false;
                    }
                } else throw new Error('Error. "' + interfaces[i].constructor.name + '" is not interface!');
            }
        } else if (typeof interfaces === 'function' && new (interfaces) instanceof PrototypeInterface) {
            for (i = 0; i < this.constructor.interfaces.length; i++) {
                if (!(new (this.constructor.interfaces[i]) instanceof interfaces)) return false;
            }
        } else {
            throw new Error('Error. "' + interfaces.constructor.name + '" is not interface!');
        }
        return true;
    }
}
