var EventEmitter = require('events').EventEmitter; // nous permettra d'emettre nos propres evenements
var ev = new EventEmitter();

var SerialPort = require('serialport'); // original fork (v5)
var port = new SerialPort('/dev/ttyAMA0', {
	baudRate: 38400
});

const Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/hWwFg4nxc8cYgODoi4QF"));

const fs = require('fs');

var dateTime = require('node-datetime');

var buf = "";
var amount = null;
var private_key = null;
var k1 =  null;
var k2 = null;
var k3 = null;
var k4 = null;
var started = 0; // indique qu'une transaction est en cours
var creating_customer_account = 0; // indique qu'un compte client est en cours de creation
var new_customer_private_key = null;
var new_customer_public_key = null;
var transaction_status = "";
var creating_seller_account = 0; // indique qu'un compte client est en cours de creation
var new_seller_private_key = null;
var new_seller_public_key = null;
var i = 1;
var j = 1;
/***************************************************************************************************************
 * checking that the amount of the transaction has been sent to the Raspberry pi with the format {amount:11111}*
 * return the amount or null if no amount was received                                                         *
 ***************************************************************************************************************
 */
function check_amount(amt) {
	var a = amt.match(/{amount:([0-9.]+)}/); // regex a ameliorer
	if (a != null) {
		return (a[1]);
	}
	else
		return (null);
}

/*************************************************************************************************************************************************
 * checking that the private key to be used for the transaction has been sent to the Raspberry pi with the format Block  2 : xxxx Block  4 : xxxx*
 * assuming that the private key is located in block 3 and 4 of the rfid card                                                                    *
 * assign the private key sent to the variable private_key                                                                                       *
 *************************************************************************************************************************************************
 */
function check_private_key(pkey) {
	var k = pkey.match(/Block   1 : ([0-9 ABCDEF]{47})/);
	if (k != null)
		k1 = k[1]; // on recupere la premiere partie de la cle privee qui est stockee dans le block 2
	k = null;
	k = pkey.match(/Block   2 : ([0-9 ABCDEF]{47})/);
	if (k != null)
		k2 = k[1]; // on recupere la deuxieme partie de la cle privee qui est stockee dans le block 4
	console.log("TEST" + k1 + k2 + "/" + amount + "/");

	if (k1 != null && k2 != null)
	{
		private_key = k1.replace(/\s/g, '') + k2.replace(/\s/g, ''); // on supprime les espaces et on assemble les deux parties de la cle

		console.log("OK");
	}
}

function get_seller_private_key(pkey) {
	var k = pkey.match(/{private_key:([0-9 xabcdefXABCDEF]*)}/);
	if (k != null)
		return (k[1]);
}

function get_seller_public_key(pkey) {
	var k = pkey.match(/{public_key:([0-9 xabcdefXABCDEF]*)}/);
	if (k != null) {
		console.log('getting seller public key: ' + k[1]);
		return (k[1]);
	}
	else
		return (0);
}


function check_transaction_status(b) {
	let pos = b.search('check_transaction');
	console.log("POS = " + pos);
	if (pos >= 0)
	{
		port.write(Buffer.from(transaction_status + '\0'), function(err, results) {
			console.log('transaction confirmation' + transaction_status);
		});
	}
}

function check_error(b) {
	let pos = b.search('ERR');
	console.log("POS = " + pos);
	if (pos >= 0)
	{
		transaction_status = 'transaction failed';
		port.write(Buffer.from(transaction_status + '\0'), function(err, results) {
			console.log('transaction failed');
		});
	}
}

function get_date(b) {
	let pos = b.search('date');
	console.log("POS = " + pos);
	if (pos >= 0)
	{
		var dt = dateTime.create();
	}
}

function start_transaction(b) {
	let pos = b.search('new_transaction');
	console.log("POS = " + pos);
	if (started == 0 && pos >= 0)
	{
		amount = null;
		private_key = null;
		k1 = null;
		k2 = null;
		k3 = null;
		k4 = null;
		started = 1;
	}
}

function end_transaction() {
	started = 0; // transaction not started
	buf = ""; // clear the buffer
}

function reset(b) {
	let pos = b.search('reset');
	if (pos >= 0)
	{
		buf = "";
		amount = null;
		private_key = null;
		k1 =  null;
		k2 = null;
		k3 = null;
		k4 = null;
		started = 0; // indique qu'une transaction est en cours
		creating_customer_account = 0; // indique qu'un compte client est en cours de creation
		new_customer_private_key = null;
		new_customer_public_key = null;
		transaction_status = "";
		creating_seller_account = 0; // indique qu'un compte client est en cours de creation
		new_seller_private_key = null;
		new_seller_public_key = null;
		i = 1;
		j = 1;
	}
}

function start_creating_customer_account(b) {
	let pos = b.search('create_customer_account');
	if (creating_customer_account == 0 && pos >= 0)
	{
		new_customer_private_key = null;
		new_customer_public_key = null;
		creating_customer_account = 1;
	}
}

async function send_customer_private_key(b) {
	let pos = b.search('private_key');
	if (pos >= 0)
	{
		await port.write(Buffer.from(new_customer_private_key + '\0'), function(err, results) {
			console.log('customer private key sent');
			buf = "";
		});
	}
}

async function send_customer_public_key(b) {
	let pos = b.search('public_key');
	if (pos >= 0)
	{
		await port.write(Buffer.from(new_customer_public_key + '\0'), function(err, results) {
			console.log('customer public key sent');
			buf = "";
		});
	}
}

function start_creating_seller_account(b) {
	let pos = b.search('create_seller_account');
	if (creating_seller_account == 0 && pos >= 0)
	{
		new_seller_private_key = null;
		new_seller_public_key = null;
		creating_seller_account = 1;
	}
}

async function send_seller_private_key(b) {
	let pos = b.search('private_key');
	if (pos >= 0)
	{
		await port.write(Buffer.from(new_seller_private_key + '\0'), function(err, results) {
			console.log('seller private key sent');
			buf = "";
		});
	}
}

async function send_seller_public_key(b) {
	let pos = b.search('public_key');
	if (pos >= 0)
	{
		await port.write(Buffer.from(new_seller_public_key + '\0'), function(err, results) {
			console.log('seller public key sent');
			buf = "";
		});
	}
}



port.on("open", function () { // quand la connexion UART se fait
	console.log('open');

	port.on('data', function(data) { // on commence a ecouter les datas qu'on recoit
		buf += data; // on concatene les datas au fur et a mesure qu'on les recoit dans un buffer
		console.log("BUF:" + buf);
		
		check_transaction_status(buf);
		check_error(buf);
		reset(buf);
		/********** TRANSACTION ***********/  
		console.log("started = " + started);
		start_transaction(buf);
		if (started == 1) { // si la transaction a commence on va recuperer les infos
			var tmp = check_amount(buf); // on recupere le montant de la transaction
			if (tmp != null)
				amount = tmp;
			check_private_key(buf); // on recupere la cle privee
		}
		console.log("STARTED=" + started + " KEY=" + private_key + " AMOUNT= " + amount);
		if (started == 1 && amount != null && private_key != null)
			ev.emit('transaction', 'new transaction'); // quand on a recupere toute les infos nous permettant d'effectuer la transaction on lance un nouvel evenement

		/********* CUSTOMER ACCOUNT CREATION ***********/
		if (creating_customer_account == 0)
		{
			start_creating_customer_account(buf);
			console.log("CREATE=" + creating_customer_account);
			if (creating_customer_account == 1)
			{
				let account = web3.eth.accounts.create();  // create a new account with public and private keys
				console.log(account);
				new_customer_private_key = (account.privateKey).substring(2);
				new_customer_public_key = (account.address).substring(2);
			}
		}
		if (creating_customer_account == 1)
		{			
			send_customer_private_key(buf);
			send_customer_public_key(buf);
		}
		
		/********* SELLER ACCOUNT CREATION ***********/
		if (creating_seller_account == 0)
		{
			start_creating_seller_account(buf);
			console.log("CREATE=" + creating_seller_account);
			if (creating_seller_account == 1)
			{
				let account = web3.eth.accounts.create();  // create a new account with public and private keys
				console.log(account);
				new_seller_private_key = (account.privateKey).substring(2);
				new_seller_public_key = (account.address).substring(2);
				fs.writeFile('seller_account.txt', '{private_key:0x' + new_seller_private_key + '}{public_key:0x' + new_seller_public_key + '}', 'ascii', function (){ console.log('seller account saved to raspberry'); });
			}
		}
		if (creating_seller_account == 1)
		{			
			send_seller_private_key(buf);
			send_seller_public_key(buf);
		}


});
});

console.log("test");

ev.on('transaction', async function(message) { // evenement qui est lance lorsqu'une nouvelle transaction peut demarrer = on a recuperer le montant et la cle privee
	console.log(message + amount + private_key);
	if (i == 1)
	await fs.readFile('seller_account.txt', function(err, data) {
		console.log('amount ==== ' + amount);
		send_eth(private_key, get_seller_public_key(data.toString('ascii')), amount); 
	});
	i++;
	//end_transaction(); // fin de la transaction, on reset les variables pour se preparer a la prochaine transaction
});

if (amount != null && private_key != null) {
	console.log("amount:" + amount + " private_key:" + private_key);
}






//send_eth('0x21882bb650283709ff7d653fc80f7a2ae196624d38dbf0154e3845ea611341d6', '0x961C0820ac2C7975C54f2225AfbECE63A3273Af3', 0.5);

//get_balance('0x961C0820ac2C7975C54f2225AfbECE63A3273Af3');

function get_balance(add) {
	web3.eth.getBalance(add, function(error, result) {
		if (!error)
			console.log('Ether: ', web3.utils.fromWei(result, 'ether'));
		else
			console.log('An error occured somewhere');
	});
}

function send_eth(from, to, amount) {
	console.log("do transaction");
	console.log('customer private key:0x' + from + "...");
	web3.eth.accounts.signTransaction({
		to: to,
		value: web3.utils.toWei(amount, "ether"),
		gas: 21000
	}, '0x' + from)
		.then(r => {
			console.log(r.rawTransaction);
			web3.eth.sendSignedTransaction(r.rawTransaction).on('receipt', r => {
				console.log;
				transaction_status = 'transaction success';
				if (j == 1)
					port.write(Buffer.from(transaction_status + '\0'), function(err, results) {
						console.log('transaction success');
						j++;
					})
						.catch(console.log("fail"))
			})
				.catch( r => { console.log("error");
					transaction_status = 'transaction fail';
					port.write(Buffer.from(transaction_status + '\0'), function(err, results) {
						console.log('transaction fail');
						reset('reset');
						transaction_status = 'transaction fail';
					});
				});
		});
}
