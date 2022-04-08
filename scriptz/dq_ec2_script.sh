source ./.biz9_config.sh

############################################################### biz9-web_script_start
dir="scriptz";
alias 9_mongo_dump='bash $dir/dq_mongo_dump.sh';
alias 9_mongo_list_dump='bash $dir/dq_mongo_list_dump.sh';
alias 9_mongo_restore='bash $dir/dq_mongo_restore.sh';
alias 9_search_filez='bash $dir/dq_search_filez.sh';

alias 9_mongo_shell='mongo --shell --port 27019';
alias 9_mongo_restore='bash $dir/dq_mongo_restore.sh';
alias 9_search_filez='bash $dir/dq_search_filez.sh';

alias 9_mongo_start="sudo mongod --fork --config /etc/mongo";
################################################################ biz9-web_script_start


############################################################### bash_sudo_start

alias 9_server_edit='cd /etc/nginx/conf.d/';
alias 9_server_restart='service nginx restart';
alias 9_server_start='service nginx start';
alias 9_server_stop='killall node'

alias 9_app_start='forever start bin/www';
alias 9_app_stop='forever stopall';
alias 9_app_list='forever list';
alias 9_app_restart='forever restart bin/www';

alias 9_mongo_open_shell="mongo --shell --port 27019";
alias 9_mongo_stop='service mongod stop';
alias 9_mongo_start='service mongod start';
alias 9_mongo_run='mongod --fork --config /etc/mongod.conf';

alias 9_go_home='cd /home/admin/www/';
export PATH=~/.npm-global/bin:$PATH;
################################################################ bash_sudo_end
