PROJECT_ROOT=$(cd $(dirname "$0") && pwd -P | sed s/scripts//g)

if [ -z $1 ]; then
    echo Environment not provided ["dev", "prod"]
    exit 1
elif [ $1 = "dev" ]; then
    GOOGLE_PROJECT_ID=klikni-jadi-dev
elif [ $1 = "prod" ]; then
    GOOGLE_PROJECT_ID=klikni-jadi-platform
else 
    echo Invalid environment
    exit 1
fi

gcloud config set project $GOOGLE_PROJECT_ID
echo Using project $GOOGLE_PROJECT_ID

gcloud builds submit --tag gcr.io/$GOOGLE_PROJECT_ID/klikni-jadi-api \
  --project=$GOOGLE_PROJECT_ID $PROJECT_ROOT

gcloud beta run deploy klikni-jadi-api \
  --image gcr.io/$GOOGLE_PROJECT_ID/klikni-jadi-api \
  --platform managed \
  --region europe-west3 \
  --project=$GOOGLE_PROJECT_ID

  GOOGLE_PROJECT_ID=klikni-jadi-dev
  gcloud config set project $GOOGLE_PROJECT_ID
  echo Using project $GOOGLE_PROJECT_ID
