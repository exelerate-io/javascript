#!/bin/bash

project=$1
name=$2

output_prefix=$(date +%d-%m-%Y)
source_bucket="gs://${project}.appspot.com/${name}"

gcloud config set project $project

gcloud firestore export $source_bucket --async

