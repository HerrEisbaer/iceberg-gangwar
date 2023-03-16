fx_version 'cerulean'
game 'gta5'

author 'Eisboerg'
description 'wenn du das liest ist das nicht deine resource, also gib sie wieder her'
version '1.0.0'

ui_page 'html/main.html'

files {
    'html/main.html',
    'html/*',
    'html/css/*',
    'html/js/*',
    'schemas/*',
    'img/*',
    'img/buttons/*',
    'img/fraktionen/*',
    'defaultclothing.json',
    'frakcrator/*',
    'clothing.json',
    'fraks.json',
    'cars.json'
}

client_script 'client.js'

server_script 'server.js'

shared_script '@pmc-callbacks/import.lua'