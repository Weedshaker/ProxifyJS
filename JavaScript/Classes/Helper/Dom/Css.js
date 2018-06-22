export class Css {
    // Helper Functions**********************************************
    getId(receiver, idName, id) {
        if (id !== undefined) return id;
        const ids = Array.from(receiver.classList).filter(e => e.includes(idName)) || [];
        // means it just grabs the last added style or falls back to el id || randomString
        return ids.length && ids.slice(-1)[0] !== undefined ? ids.slice(-1)[0].replace(`${idName}-`, '') : receiver.getAttribute('id') || this.getRandomString();
    }
    getStyle(style, head, idName, id) {
        if (style) return style;
        style = head.appendChild(document.createElement('style'));
        style.setAttribute('type', 'text/css');
        style.setAttribute(idName, id);
        return style;
    }
    getRandomString() {
        if (window.crypto && window.crypto.getRandomValues && navigator.userAgent.indexOf('Safari') === -1) {
            var a = window.crypto.getRandomValues(new Uint32Array(3)),
                token = '';
            for (var i = 0, l = a.length; i < l; i++) {
                token += a[i].toString(36);
            }
            return token;
        } else {
            return (Math.random() * new Date().getTime()).toString(36).replace(/\./g, '');
        }
    }
    getCssFormatted(className, css) {
        return Array.isArray(css) ? `.${className}${css.reduce((acc, curr) => acc + `.${className}${curr}`)}` : `.${className}${css}`;
    }
}