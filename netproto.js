'use strict';

var util = require('util');
var net = require('net');
var ProtoBuf = require('protobufjs');

process.on('uncaughtException', function handler(err) {
  console.log(util.inspect(err));
});

var builder = ProtoBuf.loadProtoFile("definition/Request.proto");
console.log("builder: " + util.inspect(builder));

var Exchange = builder.build("org.shu.zq.nettyprotoc.exchange");
var Request = Exchange.Request;
var Response = Exchange.Response;

var req = new Request({
  "id": 1 ,
  "msg": '12wsaqwe'
});

var client = new net.Socket();
client.connect(8888, "localhost", function handler() {
  console.log("req preparing: " + util.inspect(req.encodeDelimited()));
  client.write(req.encodeDelimited().toBuffer());
  console.log("req sent");
});

client.on('data', function handle(data) {
  console.log('response: ' + util.inspect(Response.decodeDelimited(data)));
  client.destroy();
});

client.on('close', function handle() {
  console.log('Connection closed');
});
