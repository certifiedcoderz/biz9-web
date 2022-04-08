source ./.biz9_config.sh

echo '##############'
echo 'BiZ9 GIT Reset Cache'
echo "APP ID:" ${APP_ID}
echo "APP TITLE:" ${APP_TITLE}
echo "APP VERSION:" ${APP_VERSION}
echo "REPO TITLE:" ${REPO_TITLE}
echo '##############'

  git rm -rf --cached .
  echo "exit"

echo '##############'
echo "ELEVATED!!!"
echo '##############'

exit

