source ./.biz9_config.sh

echo '##############'
echo 'BiZ9 GITHub Push'
echo "APP ID:" ${APP_ID}
echo "APP TITLE:" ${APP_TITLE}
echo "APP VERSION:" ${APP_VERSION}
echo "REPO TITLE:" ${REPO_TITLE}
echo '##############'

echo "Are you sure you want to push?"
read n
yes=$(echo $n | tr -s '[:upper:]' '[:lower:]')
if [[  "$n" = "yes"  ]] ; then
        git push git@github.com:${REPO_TITLE} master -f
else
    echo "exit"
fi

echo '##############'
echo "ELEVATED!!!"
echo '##############'

exit

