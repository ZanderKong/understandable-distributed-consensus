
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
            frame.model().title = '<h1 style="visibility:visible">Raft</h1>'
                        + '<h2 style="visibility:visible">什么是「分布式共识」</h2>'
                        + '<br/>' + frame.model().controls.html();
            layout.invalidate();
        })
        .after(500, function () {
            frame.model().subtitle = '<p style="visibility:visible"><em><a href="https://github.com/ZanderKong/understandable-distributed-consensus" target="_blank">gihub 仓库地址</a></em></h1>';
            layout.invalidate();
            frame.model().controls.show();
        })


        .after(100, function () {
            player.next();
        })
        
        player.play();
    };
});
