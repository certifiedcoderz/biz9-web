source ./.biz9_config.sh

echo '##############'
echo 'BiZ9 MONGO DUMP'
echo "APP ID:" ${APP_ID}
echo "APP TITLE:" ${APP_TITLE}
echo "APP VERSION:" ${APP_VERSION}
echo "APP MONGO PORT:" ${MONGO_PORT}
echo '##############'

DB_DATE=`date +%m-%d-%Y`

echo ${DB_DATE}
DB_DIR=db/backup/${DB_DATE}

mkdir -p ${DB_DIR}
cd ${DB_DIR}
mongodump --db ${APP_TITLE_ID} --port ${MONGO_PORT}

echo '##############'
echo "ELEVATED!!!"
echo '##############'

exit


