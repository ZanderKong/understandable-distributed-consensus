
"use strict";
/*jslint browser: true, nomen: true*/
/*global define*/

define([], function () {
    return function (frame) {
        var player = frame.player(),
            layout = frame.layout();

        frame.after(1, function() {
            frame.model().clear();
            layout.invalidate();
        })

        .after(500, function () {
            frame.model().title = '<h1 style="visibility:visible">谢谢观看~</h1>'
                        + '<br/>' + frame.model().controls.html();
            layout.invalidate();
        })
        .after(500, function () {
            frame.model().controls.show();
        })

        .after(500, function () {
            frame.model().title = '<h2 style="visibility:visible">相关链接</h2>'
                        + '<h3 style="visibility:visible"><a href="https://raft.github.io/raft.pdf">参考文献</a></h3>'
                        + '<h3 style="visibility:visible"><a href="https://raft.github.io/">Raft 项目地址</a></h3>'
                        + '<h3 style="visibility:visible"><a href="https://github.com/benbjohnson/thesecretlivesofdata">原项目地址</a></h3>'
                        + '<br/>' + frame.model().controls.html();
            layout.invalidate();
        })
        
        player.play();
    };
});
