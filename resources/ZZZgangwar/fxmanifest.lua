fx_version 'cerulean'
game 'gta5'

author 'Eisboerg'
description 'Kranker Dev eben'
version '1.0.0'

resource_type 'gametype' { name = 'My awesome game type!' }

ui_page 'main.html'

files {
    'html/*',
    'html/css/*',
    'html/js/*',
    'html/img/*',
    'html/img/fraktionen/*',
    'html/img/cars/*',
    'frakcreator/*',
    --FrakOutfit:
    'html/img/fraktionen/kleidung/bloods/*',
    'html/img/fraktionen/kleidung/grove/*',
    'html/img/fraktionen/kleidung/lcn/*',
    'html/img/fraktionen/kleidung/mg13/*',
    'html/img/fraktionen/kleidung/police/*',
    'html/img/fraktionen/kleidung/triaden/*',
    'html/img/fraktionen/kleidung/vagos/*',
    'background.webp',
    'schemas/*',
    'main.html',
    'main.css',
    'main.js'
}

client_script 'client.js'

server_scripts {
    'server.js'
}