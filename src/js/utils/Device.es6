import Vector2d from "utils/Vector2d";
/**
 * Class utility for get system browser window size
 *
 * @class Device
 * @exports module:utils/Device
 *
 * @constructor
 */
export default class Device {
    static _browser;
    static _version;

    static get browser() {
        if (!Device._browser) Device.getVersion();
        return Device._browser;
    };

    static get version() {
        if (!Device._version) Device.getVersion();
        return Device._version;
    };

    constructor() {
        let documentWidth = parseInt(Math.max(
            document.documentElement['clientWidth'],
            document.body['scrollWidth'],
            document.documentElement['scrollWidth'],
            document.body['offsetWidth'],
            document.documentElement['offsetWidth']
        ));

        let documentHeight = parseInt(Math.max(
            document.documentElement['clientHeight'],
            document.body['scrollHeight'],
            document.documentElement['scrollHeight'],
            document.body['offsetHeight'],
            document.documentElement['offsetHeight']
        ));

        this.width = documentWidth < parseInt(screen.width) ? documentWidth : parseInt(screen.width);
        this.height = documentHeight < parseInt(screen.height) ? documentHeight : parseInt(screen.height);
    }

    /**
     * @returns {Device}
     */
    onResize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        return this;
    }

    /**
     * @returns {number}
     */
    getWidth() {
        return this.width;
    }

    /**
     * @returns {number}
     */
    getHeight() {
        return this.height;
    }

    /**
     * @returns {Vector2d}
     */
    getSize() {
        return new Vector2d(this.width, this.height);
    }

    static getVersion = () => {
        let userAgent = navigator.userAgent, temp,
            match = userAgent.match(/(vivaldi|opera|chrome|safari|firefox|msie|edge(?=\/)|trident(?=\/))\/?\s*(\d+)/i)
                || [];
        if (/trident/i.test(match[1]) || /edge/i.test(match[1])) {
            temp = /\brv[ :]+(\d+)/g.exec(userAgent) || [];

            Device._browser = 'IE';
            Device._version = parseFloat(temp[1] || '');
            return ['IE', temp[1] || ''];
        }

        if (match[1] === 'Chrome') {
            temp = userAgent.match(/\b(OPR|Edge|Vivaldi)\/(\d+(\.\d+))/);
            if (temp !== null) {
                Device._browser = temp[1].replace('OPR', 'Opera');
                Device._version = parseFloat(temp[2]);
                return [temp[1].replace('OPR', 'Opera'), temp[2]];
            }
        }
        match = match[2] ? [match[1], match[2]] : [navigator.appName, navigator.appVersion, '-?'];
        if ((temp = userAgent.match(/version\/(\d+)/i)) !== null) match.splice(1, 1, temp[1]);

        Device._browser = match[0];
        Device._version = parseFloat(match[1]);

        return [match[0], match[1]];
    };
}
