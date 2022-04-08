source ./.biz9_config.sh

echo '##############'
echo 'BiZ9-MOBILE MONGO INSTALL'
echo "APP ID:" ${APP_ID}
echo "APP TITLE:" ${APP_TITLE}
echo "APP VERSION:" ${APP_VERSION}
echo "APP MONGO PORT:" ${MONGO_PORT}
echo '##############'

#DB_DATE=`date +%d%b%Y`

G_MY_BOSS_APP_DB='mybossapp'
G_MY_BOSS_APP_FOLDER_ID='mobile'
DB_DIR=db/backup/${G_MY_BOSS_APP_DB}

cd ${DB_DIR}
mongorestore --db ${G_MY_BOSS_APP_DB}   ${G_APP_ID}${G_MY_BOSS_APP_FOLDER_ID} --port ${MONGO_PORT}

echo '##############'
echo "ELEVATED!!!"
echo '##############'

exit


