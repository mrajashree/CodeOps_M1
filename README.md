# CSC 591/791 DevOps, Fall 2015

## PROJECT MILESTONE #1

**TEAM:** 
*Kriti Bhandari - kbhanda*
*Rajashree Mandaogane - rsmandao*
*Ravina Dhruve - rrdhruve*

**CONTRIBUTION**
+ Kriti Bhandari - Droplet creation and README
+ Rajashree Mandaogane - Building Jenkins server and gif
+ Ravina Dhruve - Post build execution and README
___

### LINK TO PROJECT REPO
https://github.com/mrajashree/requests

### CREATING BUILD SERVER
We are hosting the Jenkins server on a droplet of Digital Ocean. 
Thus, we would need to create an account on Digital Ocean
with the token and SSH Key ID.

**TASKS**

+ Create a DigitalOcean account and create a personal access token.
```
Go to DigitalOcean -> API tab -> Generate New Token -> Save the token
```


+ Run npm install to install all dependencies from package.json.
```
npm install
```


+ To automatically provision a jenkins server machine, run a node.js script that:
	- Creates a droplet with the above saved token and an SSH_KEY ID 
	  (obtained from an API call to DigitalOcean with public key of local machine).
	- Obtains the IP address of the created droplet using its dropletID.
The token and sshid needs to be specified as arguments.
```
node jenkins_server.js -token <token> -sshid <ssh_key id of your machine>
```
Note: In the gif recording the token and ssh id arguments are taken from the node.js file
which is not present in the repo files for security reasons. It runs as:
```
node jenkins_server.js
```


+ SSH into the machine.
Copy (scp) the setup.sh file into it. 
Run the setup.sh file. This will install Jenkins, start Jenkins and will install git
on the droplet.
```
ssh root@dropletIP
scp setup.sh root@<dropletIP>:setup.sh
sh setup.sh
```


+ Configure the following on Jenkins server:
- Create user: 
```
On Jenkins Dashboard -> Manage Jenkins -> Configure Global security -> Enable security
Then, Manage Jenkins -> Manage Users -> Create user
```
- Install GitHub plugin: 
```
Manage Jenkins -> Manage Plugins -> Add GitHub plugin
```
- Install Email-extension plugin: 
```
Manage Jenkins -> Manage Plugins -> Add Email-ext plugin
```


+ Adding Webhook on the git repo which we want to build so that when a git commit is pushed,
it will allow triggering of build server for this repo.
In the github repo [project], go to Settings  -> Webhooks & services  -> Add webhook 
-> Enter the IP and Jenkins (GitHub plugin) as:
```
http://<IP>:8080/github-webhook/
``` 
Note: Make sure Git is installed on the droplet hosting jenkins.


+ Configure job on Jenkins server.
- Create a new job.
```
New Item -> Enter Item name -> Freestyle project
```
- In its Configuration:
```
In SCM -> Select git -> give repo URL as the HTTPS URL of the GitHub repo and branch as */master.
In Build triggers, select option -> Build when a change is pushed to GitHub
In Add Build step, select option Execute shell -> sh build.sh
```

Thus, whenever a push is made to the repo, a build will be triggered on this server and the
Execute shell option will execute these commands.


+ Add post-build step as email notification
```
Manage Jenkins -> Configure system -> Jenkins location -> System Admin e-mail address: “your email”

In Extended e-mail notification and Email notification:
Enter smtp server: smtp.gmail.com
In advanced - Use SMTP, enter username and password for gmail, Use SSL, enter port: 465, enter
default recipients.

In Job configuration:
Post build -> editable email notification and email notification-> enter email addresses
```

Note:
To avoid sudo warning: Add in jenkins /etc/sudoers: 
%jenkins ALL=NOPASSWD: ALL

Note:
While creating different jobs for different branches, add the corresponding branch name
after GIT repo URL.
___


**SCREENCAST LINK: **

![alt text](./m1.gif "Gif recording")

Tool used: Camtasia
___


**File Description:**

+ README.md - this current file.
+ jenkins_server.js - the node.js file which creates droplet and gets its IP.
+ setup.sh - this file installs jenkins and git on the droplet to host the jenkins server.
