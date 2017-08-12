module.exports = {
    'getBrowser': function(useragent) {
        var ua = useragent, $ = {};

        if (/mobile/i.test(ua))
            $.Mobile = true;

        if (/like Mac OS X/.test(ua)) {
            $.os = 'iOS ' + /CPU( iPhone)? OS ([0-9\._]+) like Mac OS X/.exec(ua)[2].replace(/_/g, '.');
            $.iPhone = /iPhone/.test(ua);
            $.iPad = /iPad/.test(ua);
        }

        if (/Android/.test(ua))
            $.os = 'Android ' + /Android ([0-9\.]+)[\);]/.exec(ua)[1];

        if (/webOS\//.test(ua))
            $.os = 'WebOS ' + /webOS\/([0-9\.]+)[\);]/.exec(ua)[1];

        if (/(Intel|PPC) Mac OS X/.test(ua))
            $.os = 'macOS ' + /(Intel|PPC) Mac OS X ?([0-9\._]*)[\)\;]/.exec(ua)[2].replace(/_/g, '.') || true;

        if (/Windows NT/.test(ua))
            $.os = 'Windows ' + /Windows NT ([0-9\._]+)[\);]/.exec(ua)[1];

        if( /firefox/i.test(ua))
          $.browser = 'Mozilla Firefox';
        else if( /chrome/i.test(ua))
          $.browser = 'Google Chrome';
        else if( /safari/i.test(ua))
          $.browser = 'Safari';
        else if( /msie/i.test(ua))
          $.browser = 'MS Internet Explorer';
        else
          $.browser = 'unknown';

        return $;
    }
}
