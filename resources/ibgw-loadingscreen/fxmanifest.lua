fx_version 'cerulean'
game 'gta5'

author 'Eisboerg'
description 'hier gibts rp'
version '4.2.0'

ui_page 'html/main.html'

files {
    'loadscreen.html',
    'html/main.css',
    'html/main.js',
    'html/*',
    'html/img/*',
    'html/video/*',
    'html/audio/*'
}

server_script 'server.lua'

loadscreen 'loadscreen.html'
loadscreen_cursor 'yes'
loadscreen_manual_shutdown 'yes'