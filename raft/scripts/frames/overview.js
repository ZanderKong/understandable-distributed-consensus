
"use strict";
/*jslint browser: true, nomen: true*/
/*global define*/

define(["../model/log_entry"], function (LogEntry) {
    return function (frame) {
        var player = frame.player(),
            layout = frame.layout(),
            model = function() { return frame.model(); },
            client = function(id) { return frame.model().clients.find(id); },
            node = function(id) { return frame.model().nodes.find(id); },
            wait = function() { var self = this; model().controls.show(function() { player.play(); self.stop(); }); };

        frame.after(1, function() {
            model().nodeLabelVisible = false;
            model().clear();
            model().nodes.create("a");
            model().nodes.create("b");
            model().nodes.create("c");
            layout.invalidate();
        })

        .after(800, function () {
            model().subtitle = '<h2><em>Raft</em> 就是一个实现分布式共识的协议。</h2>'
                           + model().controls.html();
            layout.invalidate();
        })
        .after(100, wait).indefinite()
        .after(100, function () {
            frame.snapshot();
            model().subtitle = '<h2>让我们看看 Raft 是怎么工作的：</h2>'
                           + model().controls.html();
            layout.invalidate();
        })
        .after(100, wait).indefinite()


        .after(100, function () {
            frame.snapshot();
            model().zoom([node("b")]);
            model().subtitle = '<h2>节点一般扮演着以下三种角色：</h2>'
                           + model().controls.html();
            layout.invalidate();
        })
        .after(100, wait).indefinite()
        .after(100, function () {
            frame.snapshot();
            node("b")._state = "follower";
            model().subtitle = '<h2>追随者：The <em>Follower</em> state,</h2>'
                           + model().controls.html();
            layout.invalidate();
        })
        .after(100, wait).indefinite()
        .after(100, function () {
            frame.snapshot();
            node("b")._state = "candidate";
            model().subtitle = '<h2>候选者：the <em>Candidate</em> state,</h2>'
                           + model().controls.html();
            layout.invalidate();
        })
        .after(100, wait).indefinite()
        .after(100, function () {
            frame.snapshot();
            node("b")._state = "leader";
            model().subtitle = '<h2>领导（主节点）： the <em>Leader</em> state.</h2>'
                           + model().controls.html();
            layout.invalidate();
        })
        .after(100, wait).indefinite()

        .after(300, function () {
            frame.snapshot();
            model().zoom(null);
            node("b")._state = "follower";
            model().subtitle = '<h2>所有节点都会扮演其中一种角色。</h2>'
                           + model().controls.html();
            layout.invalidate();
        })
        .after(100, wait).indefinite()
        .after(100, function () {
            frame.snapshot();
            model().subtitle = '<h2>当追随者们接收不到领导的音讯了，</h2>'
                           + model().controls.html();
            layout.invalidate();
        })
        .after(100, function () {
            node("a")._state = "candidate";
            layout.invalidate();
        })
        .after(100, wait).indefinite()
        .after(100, function () {
            frame.snapshot();
            model().subtitle = '<h2>那么它们就会去拉票，请求其他节点投票给自己。</h2>'
                           + model().controls.html();
            layout.invalidate();
        })
        .after(100, function () {
            model().send(node("a"), node("b"), {type:"RVREQ"})
            model().send(node("a"), node("c"), {type:"RVREQ"})
            layout.invalidate();
        })
        .after(100, wait).indefinite()
        .after(100, function () {
            frame.snapshot();
            model().subtitle = '<h2>其他节点就会响应它的请求。</h2>'
                           + model().controls.html();
            layout.invalidate();
        })
        .after(300, function () {
            model().send(node("b"), node("a"), {type:"RVRSP"}, function () {
                node("a")._state = "leader";
                layout.invalidate();
            })
            model().send(node("c"), node("a"), {type:"RVRSP"}, function () {
                node("a")._state = "leader";
                layout.invalidate();
            })
            layout.invalidate();
        })
        .after(100, wait).indefinite()
        .after(100, function () {
            frame.snapshot();
            model().subtitle = '<h2>追随者节点如果拿到大多数节点的投票，那么它将成为领导节点。</h2>'
                           + model().controls.html();
            layout.invalidate();
        })
        .after(100, wait).indefinite()
        .after(100, function () {
            frame.snapshot();
            model().subtitle = '<h2>这个过程就叫做 <em>选主（Leader Election）</em>。</h2>'
                           + model().controls.html();
            layout.invalidate();
        })
        .after(100, wait).indefinite()


        .after(100, function () {
            frame.snapshot();
            model().subtitle = '<h2>系统中所有的修改都会通过主节点、</h2>'
                           + model().controls.html();
            layout.invalidate();
        })
        .after(100, wait).indefinite()
        .after(100, function () {
            frame.snapshot();
            model().subtitle += " ";
            model().clients.create("x");
            layout.invalidate();
        })
        .after(1000, function () {
            client("x")._value = "5";
            layout.invalidate();
        })
        .after(500, function () {
            model().send(client("x"), node("a"), null, function () {
                node("a")._log.push(new LogEntry(model(), 1, 1, "SET 5"));
                layout.invalidate();
            });
            layout.invalidate();
        })
        .after(100, wait).indefinite()
        .after(100, function () {
            frame.snapshot();
            model().subtitle = '<h2>所有的修改都会被包装成一条指令添加到日中中。</h2>'
                           + model().controls.html();
            layout.invalidate();
        })
        .after(100, wait).indefinite()
        .after(100, function () {
            frame.snapshot();
            model().subtitle = '<h2>这条指令还没有被上传时，节点本身内容不会被修改。</h2>'
                           + model().controls.html();
            layout.invalidate();
        })
        .after(100, wait).indefinite()
        .after(300, function () {
            frame.snapshot();
            model().send(node("a"), node("b"), {type:"AEREQ"}, function () {
                node("b")._log.push(new LogEntry(model(), 1, 1, "SET 5"));                
                layout.invalidate();
            });
            model().send(node("a"), node("c"), {type:"AEREQ"}, function () {
                node("c")._log.push(new LogEntry(model(), 1, 1, "SET 5"));
                layout.invalidate();
            });
            model().subtitle = '<h2>但是在上传前，主节点需要先请求追随者们将这条指令复制到他们的日志中去</h2>'
                           + model().controls.html();
            layout.invalidate();
        })
        .after(100, wait).indefinite()
        .after(100, function () {
            frame.snapshot();
            model().send(node("b"), node("a"), {type:"AEREQ"}, function () {
                node("a")._commitIndex = 1;
                node("a")._value = "5";
                layout.invalidate();
            });
            model().send(node("c"), node("a"), {type:"AEREQ"});
            model().subtitle = '<h2>当绝大多数节点复制完成后，</h2>'
                           + model().controls.html();
            layout.invalidate();
        })
        .after(1000, function () {
            node("a")._commitIndex = 1;
            node("a")._value = "5";
            layout.invalidate();
        })
        .after(100, wait).indefinite()
        .after(100, function () {
            frame.snapshot();
            model().subtitle = '<h2>这条指令目前才会被提交，同时节点现在的值就是 "5" 了。</h2>'
                           + model().controls.html();
            layout.invalidate();
        })
        .after(100, wait).indefinite()
        .after(100, function () {
            frame.snapshot();
            model().send(node("a"), node("b"), {type:"AEREQ"}, function () {
                node("b")._value = "5";
                node("b")._commitIndex = 1;
                layout.invalidate();
            });
            model().send(node("a"), node("c"), {type:"AEREQ"}, function () {
                node("c")._value = "5";
                node("c")._commitIndex = 1;
                layout.invalidate();
            });
            model().subtitle = '<h2>然后领导节点会通知其他节点"命令已经提交了"。</h2>'
                           + model().controls.html();
            layout.invalidate();
        })
        .after(100, wait).indefinite()
        .after(100, function () {
            frame.snapshot();
            model().subtitle = '<h2>现在我们可以说：该集群现已达成共识。</h2>'
                           + model().controls.html();
            layout.invalidate();
        })
        .after(100, wait).indefinite()


        .after(300, function () {
            frame.snapshot();
            model().subtitle = '<h2>这个过程就叫做 <em>日志复制</em>.</h2>'
                           + model().controls.html();
            layout.invalidate();
        })
        .after(100, wait).indefinite()


        .after(300, function () {
            frame.snapshot();
            player.next();
        })


        player.play();
    };
});
