source ./.biz9_config.sh

echo '##############'
echo 'BiZ9 GIT CodeCommit Test'
echo "APP ID:" ${APP_ID}
echo "APP TITLE:" ${APP_TITLE}
echo "APP VERSION:" ${APP_VERSION}
echo "IP ADDRESS:" ${EC2_IP_ADDR}
echo '##############'

ssh git-codecommit.us-east-1.amazonaws.com

echo '##############'
echo "ELEVATED!!!"
echo '##############'


exit
