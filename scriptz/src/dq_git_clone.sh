source ./.biz9_config.sh

echo '##############'
echo 'BiZ9 GIT CLONE BRANCH'
echo "APP ID:" ${APP_ID}
echo "APP TITLE:" ${APP_TITLE}
echo "APP VERSION:" ${APP_VERSION}
echo '##############'

echo 'Which branch to checkout?'
read _branch

git clone --single-branch --branch ${_branch} ${REPO_URL}


echo '##############'
echo "GIT CLONE BRANCH"
echo "ELEVATED!!!"
echo '##############'

exit


