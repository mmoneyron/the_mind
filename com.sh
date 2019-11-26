#!/bin/bash

gcc -Wall jeu.c -o jeu -Iinclude/ -lpaho-mqtt3c -Llib
gcc -Wall client.c -o client -Iinclude/ -lpaho-mqtt3c -Llib
