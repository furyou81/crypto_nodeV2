#!/bin/bash

sudo cp /home/pi/crypto_nodeV2/wifi/dhcpcd.conf /etc/
sudo cp /home/pi/crypto_nodeV2/wifi/interfaces /etc/network/interfaces
sudo cp /home/pi/crypto_nodeV2/wifi/hostapd.default /etc/default/hostapd
sudo cp /home/pi/crypto_nodeV2/wifi/hostapd.inid.d /etc/init.d/hostapd
sudo cp /home/pi/crypto_nodeV2/wifi/dnsmasq.conf /etc/
sudo reboot



