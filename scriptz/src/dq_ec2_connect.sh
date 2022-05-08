source ./.biz9_config.sh

echo '##############'
echo 'BiZ9 EC2 Connect'
echo "APP ID:" ${APP_ID}
echo "APP TITLE:" ${APP_TITLE}
echo "APP VERSION:" ${APP_VERSION}
echo "IP ADDRESS:" ${EC2_IP_ADDR}
echo '##############'

EC2_KEY_DIR=other/aws/ec2_key

ssh -i ssh -i ${EC2_KEY_FILE} admin@$EC2_IP_ADDR

echo '##############'
echo "ELEVATED!!!"
echo '##############'

exit
