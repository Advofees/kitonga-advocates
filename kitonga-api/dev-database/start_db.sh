#!/bin/bash

sudo docker run -p "5433:5432" kitonga_pg

sudo docker run -p "27018:27017" kitonga_mongodb