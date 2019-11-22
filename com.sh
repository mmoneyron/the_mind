#!/bin/bash

gcc jeu.c -o jeu -Iinclude/ -lpaho-mqtt3c -Llib
gcc client.c -o client -Iinclude/ -lpaho-mqtt3c -Llib
#gcc client.c -o client -I/home/mathieu/IoT/paho.mqtt.c-master/src -lpaho-mqtt3c -L/home/mathieu/IoT/paho.mqtt.c-master/build/src
