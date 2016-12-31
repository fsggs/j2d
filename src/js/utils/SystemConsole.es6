export default class SystemConsole {
    css = (color) => {
        return 'background: ' + color + ';' +
            'background-repeat: no-repeat;' +
            'color: #1df9a8;' +
            'line-height: 16px' +
            'padding: 3px 0';
    };

    link = (color) => {
        return 'background: ' + color + ';' +
            'background-repeat: no-repeat;' +
            'font-size: 12px;' +
            'color: #446d96;' +
            'line-height: 14px';
    };

    logSystem(message, link) {
        return console.log("%c %c %c %s %c %c %c %c%s",
            this.css('#5C6166'), this.css('#4F5357'),
            this.css('#313335'), message,
            this.css('#4F5357'), this.css('#5C6166'),
            this.link('none'), this.link('none'), link
        );
    }

    log(message, level) {
        var css = '';
        if (typeof level === 'string') level = level.toLowerCase();
        switch (level) {
            case 'info':
                level = 'INFO';
                css = 'background: #308AE4; color: #fff; padding: 1px 4px';
                break;
            case 'warn':
            case 'warning':
                level = 'WARNING';
                css = 'background: #f7a148; color: #fff; padding: 1px 4px';
                break;
            case 'error':
                level = 'ERROR';
                css = 'background: #DB5252; color: #fff; padding: 1px 4px';
                break;
            case 'network':
                level = 'NETWORK';
                css = 'background: #7D2998; color: #fff; padding: 1px 4px';
                break;
            case 'debug':
            case undefined:
            default:
                level = 'DEBUG';
                css = 'background: #ADADAD; color: #fff; padding: 1px 4px';
        }
        return console.log("%c%s", css, level, message);
    };
}

