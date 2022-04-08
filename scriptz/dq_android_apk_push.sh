source ./.biz9_config.sh
echo '##############'
echo 'BiZ9 MOBILE PUSH'
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
APP_VERSION_NEW=$(INCREMENT_VERSION $APP_VERSION);
# config
rm -rf config.xml
cp -rf ${CONFIG_FILE} config.xml
sed -i "s/CONFIG_ID/${CONFIG_ID}/g" config.xml
sed -i "s/CONFIG_VERSION/${APP_VERSION_NEW}/g" config.xml
sed -i "s/APP_VERSION=.*/APP_VERSION='${APP_VERSION_NEW}'/" .biz9_config.sh
sed -i "s/G_APP_VERSION=.*/G_APP_VERSION='${APP_VERSION_NEW}'/" www/scripts/biz_scriptz/config.js
sed -i "s/APP_TITLE/${APP_TITLE}/g" config.xml
echo "BiZ9 MOBILE COPY CONFIG OK..."
cordova prepare
echo "BiZ9 MOBILE PREPARE OK...."
cordova compile
echo "BiZ9 MOBILE COMPILE OK...."
cordova build --release android --packageType=bundle
echo "BiZ9 MOBILE BUILD OK..."
#apk
${ZIPALIGN_DIR}/zipalign -f -v 4  ${APP_DEBUG_APK} ${APP_TITLE_ID}${APP_VERSION_NEW}".apk"
apksigner sign --ks-key-alias alias_name --ks ${KEY_STORE} --ks-pass pass:"${KEY_STORE_PASSWORD}" --min-sdk-version 22 ${APP_TITLE_ID}${APP_VERSION_NEW}".apk"
#jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -storepass ${KEY_STORE_PASSWORD} -keystore ${KEY_STORE} ${APP_TITLE_ID}${APP_VERSION_NEW}".apk" alias_name
echo "BiZ9 MOBILE APK APKSIGNER APK OK..."
#aab
${ZIPALIGN_DIR}/zipalign -f -v 4  ${APP_BUNDLE_RELEASE} ${APP_TITLE_ID}${APP_VERSION_NEW}".aab"
apksigner sign --ks-key-alias alias_name --ks ${KEY_STORE} --ks-pass pass:"${KEY_STORE_PASSWORD}"  --min-sdk-version 22 ${APP_TITLE_ID}${APP_VERSION_NEW}".aab"
#jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -storepass ${KEY_STORE_PASSWORD} -keystore ${KEY_STORE} ${APP_TITLE_ID}${APP_VERSION_NEW}".aab" alias_name
echo "BiZ9 MOBILE AAB OK..."
java -jar /home/mama/www/opz/toolz/bundletool/bundletool-all-1.9.1.jar build-apks --bundle=${APP_TITLE_ID}${APP_VERSION_NEW}'.aab' --output=${APP_TITLE_ID}${APP_VERSION_NEW}'.apks' --ks=${KEY_STORE} --ks-key-alias=alias_name --ks-pass=pass:${KEY_STORE_PASSWORD}
echo "BiZ9 MOBILE BUNDLETOOL OK..."
rsync -rave "ssh -2 -i ${AWS_KEY_PEM}" ${APP_TITLE_ID}${APP_VERSION_NEW}.apk  admin@${DEPLOY_IP}:${DEPLOY_LOC}
rsync -rave "ssh -2 -i ${AWS_KEY_PEM}" ${APP_TITLE_ID}${APP_VERSION_NEW}.aab  admin@${DEPLOY_IP}:${DEPLOY_LOC}
echo "#################"
echo "BiZ9 MOBILE PUSH VERSION${APP_VERSION_NEW}"
echo "BiZ9 MOBILE APP_TITLE_ID=${APP_TITLE_ID}"
echo "#################"
echo "${DOWNLOAD_URL}/${APP_TITLE_ID}${APP_VERSION_NEW}.aab"
echo "#################"
echo "${DOWNLOAD_URL}/${APP_TITLE_ID}${APP_VERSION_NEW}.apk"
echo "#################"
echo "ELEVATED!!!"
echo "#################"
##rm
rm -rf *.apk
rm -rf *.apks
rm -rf *.idsig
rm -rf *.aab

