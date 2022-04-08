source ./.biz9_config.sh

echo '##############'
echo 'BiZ9 MONGO RESTORE'
echo "APP ID:" ${APP_ID}
echo "APP TITLE:" ${APP_TITLE}
echo "APP VERSION:" ${APP_VERSION}
echo "APP MONGO PORT:" ${MONGO_PORT}
echo '##############'

#DB_DATE=`date +%d%b%Y`
echo 'Enter Date:'
read DB_DATE;


DB_DIR=db/backup/${DB_DATE}
cd ${DB_DIR}
mongorestore --db ${APP_TITLE_ID} --port ${MONGO_PORT} --drop dump/${APP_TITLE_ID}

echo '##############'
echo "ELEVATED!!!"
echo '##############'

exit


