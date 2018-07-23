#!/bin/bash

sudo cp /home/pi/crypto_nodeV2/hotspot/dhcpcd.conf /etc/
sudo cp /home/pi/crypto_nodeV2/hotspot/interfaces /etc/network/interfaces
#sudo service dhcpcd restart
sudo ifdown wlan0
sudo ifup wlan0
sudo cp /home/pi/crypto_nodeV2/hotspot/hostapd.conf /etc/hostapd/
sudo cp /home/pi/crypto_nodeV2/hotspot/hostapd.default /etc/default/hostapd
sudo cp /home/pi/crypto_nodeV2/hotspot/hostapd.init.d /etc/init.d/hostapd
sudo cp /home/pi/crypto_nodeV2/hotspot/dnsmasq.conf /etc/
sudo reboot



