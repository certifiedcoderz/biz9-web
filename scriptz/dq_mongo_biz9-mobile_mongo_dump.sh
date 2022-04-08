source ./.biz9_config.sh

echo '##############'
echo 'BiZ9-MOBILE MONGO DUMP'
echo "APP ID:" ${APP_ID}
echo "APP TITLE:" ${APP_TITLE}
echo "APP VERSION:" ${APP_VERSION}
echo "APP MONGO PORT:" ${MONGO_PORT}
echo '##############'

G_MY_BOSS_APP_DB='mybossapp'

DB_DIR=db/backup/${G_MY_BOSS_APP_DB}

mkdir -p ${DB_DIR}
cd ${DB_DIR}
mongodump --db ${G_MY_BOSS_APP_DB} --port ${MONGO_PORT}

echo '##############'
echo "ELEVATED!!!"
echo '##############'

exit


