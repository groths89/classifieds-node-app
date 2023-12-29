# Requirements

- [ ] An AWS Lightsail Instance
- [ ] AWS Route53 domain
- [ ] CircleCI account
- [ ] Github Repo for the Node project

Things Done:

- created an instance with an Ubuntu 22.04 OS instance with 1 GB of ram and 1 vCPU with 40 GB of SSD storage

- attached a static IP to the instance so it is persistant on reboot of the instance

- I didn't find it necessary to do this but I can also allow SSH on the instance by creating authorized keys on the instance. I decided to use the web based terminal pre configured for use on the AWS account. Run these on the instance.

```sh
sudo nano ~/.ssh/authorized_keys
```

- run this on local computer; or find a way to copy the .pub to your clipboard

```sh
xclip -sel clip < ~/.ssh/id_rsa.pub
```

- then reboot.
- then I can use my computers SSH client to get into the remote server

```sh
ssh ubuntu@LIGHT_SAIL_STATIC_IP
```

- next is installing node; instead of following along I installed node with NVM

- My application does not use MONGODB so decided to skip this for now, maybe I will go back to it later.

```sh
sudo apt update
sudo apt install -y mongodb
sudo systemctl enable mongodb
sudo systemctl start mongodb
sudo systemctl status mongodb
```

- I added a new user to the instance to use for deployments onto the instance and added a new password for that user. Also needed to elevate that user to use SUDO

```sh
 sudo useradd -m -d /home/dpwebserver dpwebserver
```

- I followed to create ssh keys for the Lightsail Deployment

- when running yarn start or npm start make sure you installed the node modules directory!!!

- when running yarn start after running install I got this error here:

```sh
$ yarn start
yarn run v1.22.19
$ node server.js
node:events:497
      throw er; // Unhandled 'error' event
      ^

Error: listen EACCES: permission denied 0.0.0.0:80
    at Server.setupListenHandle [as _listen2] (node:net:1855:21)
    at listenInCluster (node:net:1920:12)
    at Server.listen (node:net:2008:7)
    at Object.<anonymous> (/home/dpwebserver/app/server.js:107:8)
    at Module._compile (node:internal/modules/cjs/loader:1375:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1434:10)
    at Module.load (node:internal/modules/cjs/loader:1206:32)
    at Module._load (node:internal/modules/cjs/loader:1022:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:142:12)
    at node:internal/main/run_main_module:28:49
Emitted 'error' event on Server instance at:
    at emitErrorNT (node:net:1899:8)
    at process.processTicksAndRejections (node:internal/process/task_queues:82:21) {
  code: 'EACCES',
  errno: -13,
  syscall: 'listen',
  address: '0.0.0.0',
  port: 80
}
```

- the solution was to install the linux package `libcap2-bin` and then running the command `sudo setcap cap_net_bind_service=+ep \readlink -f \/which node/` while in the `dpwebserver` user

### TODO: Next up is running NodeJS app in the background
