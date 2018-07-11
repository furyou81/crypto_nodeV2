edit file /etc/rc.local

add the line before exit 0 : sudo sh /home/pi/crypto_node/crypto/nod.sh > /home/pi/test

remove old node
pi@raspberrypi:~ $ sudo -i
root@raspberrypi:~# apt-get remove nodered -y
root@raspberrypi:~# apt-get remove nodejs nodejs-legacy -y
root@raspberrypi:~# exit

install latest stable node
curl -L https://git.io/n-install | bash

INSTALL PHP
sudo apt install apache2
sudo apt install php
sudo apt install libapache2-mod-php

ADD www-data in root group
www-data ALL=(ALL) NOPASSWD: ALL
