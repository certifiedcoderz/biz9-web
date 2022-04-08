source ./.biz9_config.sh

echo '##############'
echo 'BiZ9 GIT REPO ADD'
echo "APP ID:" ${APP_ID}
echo "APP TITLE:" ${APP_TITLE}
echo "APP VERSION:" ${APP_VERSION}
echo "REPO TITLE:" ${REPO_TITLE}
echo '##############'

echo "Are you sure you want to add repo?"
read n
yes=$(echo $n | tr -s '[:upper:]' '[:lower:]')



if [[  "$n" = "yes"  ]] ; then
        git init
        git add -A .
        git commit -m "first commit"
        git remote add origin ${REPO_TITLE}
        git push -u origin master
else
    echo "exit"
fi

echo '##############'
echo "REPO TITLE:" ${REPO_TITLE}
echo "ELEVATED!!!"
echo '##############'

exit


