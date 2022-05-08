source ./.biz9_config.sh

echo '##############'
echo 'BiZ9 Search FileZ'
echo "APP ID:" ${APP_ID}
echo "APP TITLE:" ${APP_TITLE}
echo "APP VERSION:" ${APP_VERSION}
echo '##############'

echo 'Enter Directory ex. /path/ or blank for current'
read DIR
echo $(pwd)'/'$DIR
echo 'Enter Pattern:'
read STR
echo $STR
echo '##############'
grep -rnw $(pwd)/$DIR -e $STR

echo '##############'
echo "ELEVATED!!!"
echo '##############'

exit
