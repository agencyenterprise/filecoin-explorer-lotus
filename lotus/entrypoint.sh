#!/bin/sh

sh -c '/home/lotus/app/lotus daemon' & 
sh -c '/bin/sleep 5'
sh -c '/home/lotus/app/lotus sync wait' & 
sh -c "/home/lotus/app/chainwatch --db 'postgres://user:password@db/api-db?sslmode=disable' run"
