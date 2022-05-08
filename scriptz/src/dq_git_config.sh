source ./.biz9_config.sh

echo '##############'
echo 'BiZ9 GIT Config'
echo ${APP_TITLE}
echo ${APP_VERSION}
echo '##############'

echo 'Enter your developer name'
read config_name

echo 'Enter your developer email'
read config_email

git config --global user.email "$config_email"
git config --global user.name "$config_name"

echo '##############'
echo "ELEVATED!!!"
echo '##############'


exit
