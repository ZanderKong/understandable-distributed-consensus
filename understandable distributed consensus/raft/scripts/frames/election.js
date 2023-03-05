
"use strict";
/*jslint browser: true, nomen: true*/
/*global define*/

define([], function () {
    return function (frame) {
        var player = frame.player(),
            layout = frame.layout(),
            model = function() { return frame.model(); },
            client = function(id) { return frame.model().clients.find(id); },
            node = function(id) { return frame.model().nodes.find(id); },
            cluster = function(value) { model().nodes.toArray().forEach(function(node) { node.cluster(value); }); },
            wait = function() { var self = this; model().controls.show(function() { self.stop(); }); },
            subtitle = function(s, pause) { model().subtitle = s + model().controls.html(); layout.invalidate(); if (pause === undefined) { model().controls.show() }; };

        //------------------------------
        // Title
        //------------------------------
        frame.after(1, function() {
            model().clear();
            layout.invalidate();
        })
        .after(500, function () {
            frame.model().title = '<h2 style="visibility:visible">选主 Leader Election</h1>'
                                + '<br/>' + frame.model().controls.html();
            layout.invalidate();
        })
        .after(200, wait).indefinite()
        .after(500, function () {
            model().title = "";
            layout.invalidate();
        })

        //------------------------------
        // Initialization
        //------------------------------
        .after(300, function () {
            model().nodes.create("A").init();
            model().nodes.create("B").init();
            model().nodes.create("C").init();
            cluster(["A", "B", "C"]);
        })

        //------------------------------
        // Election Timeout
        //------------------------------
        .after(1, function () {
            model().ensureSingleCandidate();
            model().subtitle = '<h2>在 Raft 中，有两个超时设置（ timeout settings ）来控制选举。</h2>'
                           + model().controls.html();
            layout.invalidate();
        })
        .after(model().electionTimeout / 2, function() { model().controls.show(); })
        .after(100, function () {
            subtitle('<h2>第一个叫做 <span style="color:green">选举超时（election timeout）</span>.</h2>');
        })
        .after(1, function() {
            subtitle('<h2>选举超时（election timeout）：追随者需要等待多久才能成为候选者。</h2>');
        })
        .after(1, function() {
            subtitle('<h2>一般设置为： 150ms ~ 300ms.</h2>');
        })
        .after(1, function() {
            subtitle("", false);
        })

        //------------------------------
        // Candidacy
        //------------------------------
        .at(model(), "stateChange", function(event) {
            return (event.target.state() === "candidate");
        })
        .after(1, function () {
            subtitle('<h2>当「选举超时」时间到了，追随者将成为候选者斌开始一个新的<em>「选举任期」 election term</em>...</h2>');
        })
        .after(1, function () {
            subtitle('<h2>...需要拉票了这时候就...</h2>');
        })
        .after(model().defaultNetworkLatency * 0.25, function () {
            subtitle('<h2>...会向其他节点发送信息「请求你给我投票吧」...</h2>');
        })
        .after(model().defaultNetworkLatency, function () {
            subtitle('<h2>如果接收到消息的节点在本任期内尚未投票，那么它将投票给候选人</h2>');
        })
        .after(1, function () {
            subtitle('<h2>...然后节点将重其「选举超时」（election timeout）</h2>');
        })


        //------------------------------
        // Leadership & heartbeat timeout.
        //------------------------------
        .at(model(), "stateChange", function(event) {
            return (event.target.state() === "leader");
        })
        .after(1, function () {
            subtitle('<h2>一旦候选人获得多数票，它就会成为领导者。</h2>');
        })
        .after(model().defaultNetworkLatency * 0.25, function () {
            subtitle('<h2>领导节点就会发送 <em>Append Entries</em> 给其他节点</h2>');
        })
        .after(1, function () {
            subtitle('<h2>这些信息会按照指定的间隔时间发送，这个间隔时间被称为：<span style="color:red">heartbeat timeout</span>.</h2>');
        })
        .after(model().defaultNetworkLatency, function () {
            subtitle('<h2>接收到<em>Append Entries</em>信息以后，追随者们会回复「收到∠(°ゝ°)」。</h2>');
        })
        .after(1, function () {
            subtitle('', false);
        })
        .after(model().heartbeatTimeout * 2, function () {
            subtitle('<h2>这个 election term 将持续到追随者接收不到它的音讯，成为候选者。</h2>', false);
        })
        .after(100, wait).indefinite()
        .after(1, function () {
            subtitle('', false);
        })

        //------------------------------
        // Leader re-election
        //------------------------------
        .after(model().heartbeatTimeout * 2, function () {
            subtitle('<h2>让我们把1</h2>', false);
        })
        .after(100, wait).indefinite()
        .after(1, function () {
            subtitle('', false);
            model().leader().state("stopped")
        })
        .after(model().defaultNetworkLatency, function () {
            model().ensureSingleCandidate()
        })
        .at(model(), "stateChange", function(event) {
            return (event.target.state() === "leader");
        })
        .after(1, function () {
            subtitle('<h2>节点 ' + model().leader().id + ' 现在是领导啦 '  + '。</h2>', false);
        })
        .after(1, wait).indefinite()

        //------------------------------
        // Split Vote
        //------------------------------
        .after(1, function () {
            subtitle('<h2>要求多数票是为了保证每届任期只能选出一名领导人。</h2>', false);
        })
        .after(1, wait).indefinite()
        .after(1, function () {
            subtitle('<h2>当多个节点同时成为候选人，那么可能会发生拆分投票。</h2>', false);
        })
        .after(1, wait).indefinite()
        .after(1, function () {
            subtitle('<h2>简单举个🌰：</h2>', false);
        })
        .after(1, wait).indefinite()
        .after(1, function () {
            subtitle('', false);
            model().nodes.create("D").init().currentTerm(node("A").currentTerm());
            cluster(["A", "B", "C", "D"]);

            // Make sure two nodes become candidates at the same time.
            model().resetToNextTerm();
            var nodes = model().ensureSplitVote();

            // Increase latency to some nodes to ensure obvious split.
            model().latency(nodes[0].id, nodes[2].id, model().defaultNetworkLatency * 1.25);
            model().latency(nodes[1].id, nodes[3].id, model().defaultNetworkLatency * 1.25);
        })
        .at(model(), "stateChange", function(event) {
            return (event.target.state() === "candidate");
        })
        .after(model().defaultNetworkLatency * 0.25, function () {
            subtitle('<h2>两个节点都开始同一任期的选举......</h2>');
        })
        .after(model().defaultNetworkLatency * 0.75, function () {
            subtitle('<h2>每一个节点都在另一个节点之前联系上了一个追随者</h2>');
        })
        .after(model().defaultNetworkLatency, function () {
            subtitle('<h2>所以现在每个候选人都有两票</h2>');
        })
        .after(1, function () {
            subtitle('<h2>节点就会等待一个新的选举并尝试</h2>', false);
        })
        .at(model(), "stateChange", function(event) {
            return (event.target.state() === "leader");
        })
        .after(1, function () {
            model().resetLatencies();
            subtitle('<h2>节点 ' + model().leader().id + ' 拉票成功 ' + model().leader().currentTerm() + ' 所以他是领导了。</h2>', false);
        })
        .after(1, wait).indefinite()

        .then(function() {
            player.next();
        })


        player.play();
    };
});
