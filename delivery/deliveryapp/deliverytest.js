/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Gateway, Wallets } = require('fabric-network');

var http = require('http');
var formidable = require('formidable');
var fs = require('fs');
var url = require("url")

const path = require('path');

let channel1name = 'mychannel';
const ccpPath = path.resolve(__dirname, '..', 'connection-org1.json');
const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

const deliveryccname = 'delivery';


var request = require("request");
var userid = "appUser";	// default user id

async function gateWayPage(req, res) {
	if (req.url.startsWith('/adddeliverer')) {
		var form = new formidable.IncomingForm();
		form.parse(req, async function (err, fields, files) {
			let sn = fields.sn;
			let user = fields.userid;
			console.log(sn, user);
			await AddNewDeliverer(userid, sn, user);
			res.write(`success adddeliverer: ${sn} ${user}`);
			return res.end();
		});
	} else if (req.url.startsWith('/show')) {
		let method = req.method;
		console.log(req.url);
		if(method == "GET") {
			let queryData = url.parse(req.url, true).query;
			let sn = queryData.sn;
			if (sn == undefined || sn == "") {
				res.write('sn error: sn is missing');
				return res.end();
			}
			var result = await showList(userid, sn);
			if (result == undefined) {
				res.write("show error: info of sn does not exists: " + sn);
			} else {
				res.write(result.toString());
			}
			return res.end();
		}
	} else if (req.url == '/favicon.ico') {
		console.log("favicon.icon")
		return res.end();
	} else {
		var fname = "." + url.parse(req.url).pathname;
		if (url.parse(req.url).pathname == "/")
			fname = "./deliverymain.html"
		console.log(fname)

		fs.readFile(fname, async function (err, data) {
			if(err) {
				res.writeHead(404, {'Content-Type': 'text/html'});
				return res.end("404 Not Found");
			}
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.write(data);
			return res.end();
		});
	}
}


// update the mapping between drug ID and drug owner
async function AddNewDeliverer(userid, sn, user) {
	sn = sn == undefined ? "" : sn;
	user = user == undefined ? "" : user;

	console.log("AddNewDeliverer", sn, user);
	//let arglist = ['AddNewDeliverer', sn, user];
	let arglist = ['AddNewDeliverer_Simple', sn, user];
	let result = await SendTransaction(deliveryccname, userid, true, arglist, channel1name) ;
	console.log(result);
	return result;
}


// find the drug owner of a drug id
async function showList(userid, sn) {
	sn = sn == undefined ? "" : sn;
	//var arglist = ['ShowDeliverers', sn];
	var arglist = ['traceKey', sn];
	var result = await SendTransaction(deliveryccname, userid, false, arglist, channel1name) ;
	console.log(result);
	return result;
}



async function SendTransaction(ccname, userid, bInvoke, arglist, chname) {
	try {

		// Create a new file system based wallet for managing identities.
	        // Create a new file system based wallet for managing identities.
		const walletPath = path.join(process.cwd(), 'wallet');
		const wallet = await Wallets.newFileSystemWallet(walletPath);
		console.log(`Wallet path: ${walletPath}`);
		
		// Check to see if we've already enrolled the user.
		const identity = await wallet.get('appUser');
		if (!identity) {
			console.log('An identity for the user "appUser" does not exist in the wallet');
			console.log('Run the registerUser.js application before retrying');
			return;
		}
		
		// Create a new gateway for connecting to our peer node.
		const gateway = new Gateway();
		await gateway.connect(ccp, { wallet, identity: userid, discovery: { enabled: true, asLocalhost: true } });
		
		// Get the network (channel) our contract is deployed to.
		const network = await gateway.getNetwork(chname);
		
		// Get the contract from the network.
		const contract = network.getContract(ccname);

		console.log(arglist)
		let result = "";
		if (bInvoke) {
			result = await contract.submitTransaction(...arglist);
			console.log('submitTransaction ', result);
		} else {
			result = await contract.evaluateTransaction(...arglist);
			console.log("evaluateTransaction : " + result);
		}
		await gateway.disconnect();
		return result;
	} catch (error) {
		console.error(`Failed to submit transaction: ${error}`);
	}
}

http.createServer(gateWayPage).listen(8080);


