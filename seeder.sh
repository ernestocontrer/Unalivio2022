#! /bin/sh


NOW=$(date +%s)
echo "Seeding data..."
TARGET_STORAGE_BUCKET="gs://aliviame-mvp.appspot.com/data/seeds/$NOW/firestore_export"
SEED_PATH="./data/seed"
METADATA_PATH=${SEED_PATH}/firebase-export-metadata.json
gcloud firestore export $TARGET_STORAGE_BUCKET #--collection-ids='amounts','currencies','methods','pairs','products','providers','rates'


gsutil -m rsync -r $TARGET_STORAGE_BUCKET $SEED_PATH

jq '.path = "data/seed" | .metadata_file = "firestore_export.overall_export_metadata"' ${METADATA_PATH} > ${METADATA_PATH}

#firebase emulators:start --only firestore --import $SEED_PATH