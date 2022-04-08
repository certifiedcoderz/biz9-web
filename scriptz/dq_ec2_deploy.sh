source ./.biz9_config.sh

echo '##############'
echo 'BiZ9 GIT EC2 Deploy'
echo "APP ID:" ${APP_ID}
echo "APP TITLE:" ${APP_TITLE}
echo "APP VERSION:" ${APP_VERSION}
echo "IP ADDRESS:" ${EC2_IP_ADDR}
echo '##############'

EC2_KEY_DIR=other/aws/ec2_key

echo "Are you sure you want to deploy?"
read n
yes=$(echo $n | tr -s '[:upper:]' '[:lower:]')
if [[  "$n" = "yes"  ]] ; then
        rsync -rave "ssh -2 -i ${EC2_KEY_FILE}" . admin@$EC2_IP_ADDR:$EC2_DEPLOY_DIR --exclude '.git/'
fi

echo '##############'
echo "ELEVATED!!!"
echo '##############'

exit
