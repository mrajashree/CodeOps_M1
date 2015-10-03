//HW1 - Service Provider 1

var needle = require("needle");
var os   = require("os");
var fs = require("fs");

var config = {};
config.token = process.argv[3];

// This is a global ssh-key variable created for setkeys and getkeys function which is run
// only once.
global.skey = "";

var headers =
{
	'Content-Type':'application/json',
	Authorization: 'Bearer ' + config.token
};


var client =
{
	// The getkeys and setkeys function is just run once to make API calls to DigitalOcean to
	// obtain the ssh_key_id with respect to the public_key of the machine which runs this node.js
	// file to create droplets.
	/*
	getkeys: function ( onResponse )
	{
		needle.get("https://api.digitalocean.com/v2/account/keys", {headers:headers}, onResponse);
	},

	setkeys: function ( onResponse )
	{
		var data = 
		{
			"name": "My SSH Public Key",
  			"public_key": "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC58AnVypbPYL+wh0KgYfzAa6q1XVd+lDBt8uvalQ5MvAN6opN+mP6VZEDND7mxWukbfKWmAma4cP5/8li00Fz7wuaDFUvs+hNDdL4TktCvAcykTMpDSMLAzTlVPcMGZlkMdYVA8U8LE1H8SDpNx2XW1r2w8OqjbwMPLuDSORtnkyrcojpcwH9lDG/JabbPBq2AWrIG43x/GpNfQIocoqyrqUJdNlSHLk4d9CM5Qx82mRA4PqhsOk4PqAItiYTISmc8YThi7PWQbUTJnrxBP0I6dhWK4QmkV2f6uPYuUAGgSA7+UQwWs7bd45C7XTxK3JVKo8PEoctwLEmPEsd4Vm3L Ravina@Ravinas-MacBook-Pro.local"
		};

		needle.post("https://api.digitalocean.com/v2/account/keys", data, {headers:headers,json:true}, onResponse );
	},
	*/
	
	// Function to create droplets
	createDroplet: function (dropletName, region, imageName, onResponse)
	{
		var data = 
		{
			"name": dropletName,
			"region":region,
			"size":"2gb",
			"image":imageName,
			// Id to ssh_key associated with account.
			"ssh_keys":[process.argv[5]],
			"backups":false,
			"ipv6":false,
			"user_data":null,
			"private_networking":null
		};

		console.log("Attempting to create: "+ JSON.stringify(data) );
		needle.post("https://api.digitalocean.com/v2/droplets", data, {headers:headers,json:true}, onResponse );
	},

	// Function to get the IP address of the droplet based on dropletID
	getDropletIP: function ( dropletId, onResponse )
	{
		needle.get("https://api.digitalocean.com/v2/droplets/"+dropletId, {headers:headers}, onResponse)
	}
};




// #############################################
// #1 Create a droplet with the specified name, region, and image.
// Obtain the droplet id from JSON.
var name = "DevOps-"+os.hostname();
var region = "nyc1";
var image = "ubuntu-14-04-x64";

// Callback to setkeys and getkeys function. Run only once.
/*
client.setkeys(function(err, resp, body)
{
	var data = resp.body;
	global.skey = JSON.stringify(data.ssh_key.id);
	console.log(global.skey);
});

client.getkeys(function(err, resp, body)
{
	var data = resp.body;
	console.log(data);
	skey = JSON.stringify(data.ssh_keys.id);
	console.log(skey);
});
*/

// callback to createDroplet function
client.createDroplet(name, region, image, function(err, resp, body)
{
 	var data = resp.body;
 	
 	// StatusCode 202 - means server accepted request.
 	if(!err && resp.statusCode == 202)
 	{
 		var dropletId = JSON.stringify(data.droplet.id);
 		console.log( "Droplet ID: ", dropletId);
 
 		// Using setTimeout method since node.js executes code in a non-blocking manner. 
 		// Digital Ocean takes some time to assign the IP address to the droplet.
 		// Therefore, we need to allow the getDropletIP function to be executed
 		// after droplet has been assigned an IP.

		// #2 Retrieving IP address about a specific droplet.
		
		var dropletIP = "";

		setTimeout(function(){
 		client.getDropletIP(dropletId, function(error, response)
		{
			var data = response.body;

			dropletIP = JSON.stringify(data.droplet.networks.v4[0].ip_address);
			console.log( "Droplet IP: ", dropletIP );
		});
 		}, 5000);
		
    }
});
