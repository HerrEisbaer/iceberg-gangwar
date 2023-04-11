AddEventHandler('playerConnecting', function(_, _, deferrals)
    local source = source
    
    deferrals.handover({
        name = GetPlayerName(source),
        identifiers = GetPlayerIdentifiers(source)
    })
end)