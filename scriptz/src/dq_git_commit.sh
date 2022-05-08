source ./.biz9_config.sh

echo '##############'
echo 'BiZ9 GIT COMMIT'
echo "APP ID:" ${APP_ID}
echo "APP TITLE:" ${APP_TITLE}
echo "APP VERSION:" ${APP_VERSION}
echo '##############'
INCREMENT_VERSION ()
{
    declare -a part=( ${1//\./ } )
        declare    new
        declare -i carry=1

        for (( CNTR=${#part[@]}-1; CNTR>=0; CNTR-=1 )); do
            len=${#part[CNTR]}
    new=$((part[CNTR]+carry))
        [ ${#new} -gt $len ] && carry=1 || carry=0
        [ $CNTR -gt 0 ] && part[CNTR]=${new: -len} || part[CNTR]=${new}
    done
        new="${part[*]}"
        echo -e "${new// /.}"
}

APP_VERSION=$APP_VERSION;
APP_VERSION_NEW=$(INCREMENT_VERSION $APP_VERSION);
APP_TITLE_ID=$APP_TITLE_ID;

echo 'enter code commit noteZ'
read commit_notes

sed -i "s/APP_VERSION=.*/APP_VERSION='${APP_VERSION_NEW}'/" .biz9_config.sh
sed -i "s/G_APP_VERSION=.*/G_APP_VERSION='${APP_VERSION_NEW}'/" ${PROJECT_ROOT}app.js


git add -A .
git commit -m  "${commit_notes}"

echo '##############'
echo "NEW APP VERSION:" ${APP_VERSION_NEW}
echo "ELEVATED!!!"
echo '##############'

exit


