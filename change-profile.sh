#!/bin/bash

if [ $1 == "gm" ];
then
	rm -r ~/.badtaste-npm
	ln -s ~/.badtaste-npm-gm ~/.badtaste-npm
fi

if [ $1 == "vk" ];
then
	rm -r ~/.badtaste-npm
	ln -s ~/.badtaste-npm-vk ~/.badtaste-npm
fi

if [ $1 == "fs" ];
then
	rm -r ~/.badtaste-npm
	ln -s ~/.badtaste-npm-fs ~/.badtaste-npm
fi

if [ $1 == "full" ];
then
	rm -r ~/.badtaste-npm
	ln -s ~/.badtaste-npm-full ~/.badtaste-npm
fi
