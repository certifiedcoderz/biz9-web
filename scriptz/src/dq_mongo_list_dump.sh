source ./.biz9_config.sh

echo '##############'
echo 'BiZ9 MONGO DUMP LIST'
echo "APP ID:" ${APP_ID}
echo "APP TITLE:" ${APP_TITLE}
echo "APP VERSION:" ${APP_VERSION}
echo "APP MONGO PORT:" ${MONGO_PORT}
echo '##############'

ls db/backup/

echo '##############'
echo "ELEVATED!!!"
echo '##############'

exit


