/**
 * J2D (jQuery Canvas Graphic Engine plugin)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 0.2.0-dev
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['utils/ArrayMap'], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(require('utils/ArrayMap'));
    } else {
        factory(root.ArrayMap);
    }
}(typeof window !== 'undefined' ? window : global, function (ArrayMap) {
    "use strict";

    test('ArrayMap()', function () {
        var am = new ArrayMap();
        am.add('test1', 1.2);
        am.add('test2', 3.4);
        am.add('test4', "Test!");

        equal(am.length, 3);

        am.push(12);
        am['test3'] = 12.1;

        equal(am.length, 4);

        delete  am['test3'];
        am.splice(am.indexOf(12), 1);
        am.add('test4', "Test Me");

        equal(am.length, 3);
        am.remove('test4');

        ok(am.each(function (index, key) {
            //console.log(key, index, am[index]);
            return true;
        }));

        var am2 = (new ArrayMap()).add('test1', 1.2).add('test2', 3.4);
        //console.log(am);
        //console.log(am2);

        ok(am.equals(am2));
    });

}));
