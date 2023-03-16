-- Shows a notification on the player's screen 
function ShowNotification( text )
    SetNotificationTextEntry("STRING")
    AddTextComponentSubstringPlayerName(text)
    DrawNotification(false, false)
end

RegisterCommand('car', function(source, args, rawCommand)
    local x,y,z = table.unpack(GetOffsetFromEntityInWorldCoords(PlayerPedId(), 0.0, 8.0, 0.5))
    local veh = args[1]
    if veh == nil then veh = "adder" end
    vehiclehash = GetHashKey(veh)
    RequestModel(vehiclehash)
    
    Citizen.CreateThread(function() 
        local waiting = 0
        while not HasModelLoaded(vehiclehash) do
            waiting = waiting + 100
            Citizen.Wait(100)
            if waiting > 5000 then
                ShowNotification("~r~Could not load the vehicle model in time, a crash was prevented.")
                break
            end
        end
        local car = CreateVehicle(vehiclehash, GetEntityCoords(PlayerPedId()))
        SetPedIntoVehicle(PlayerPedId(), car, -1)
        SetEntityAsNoLongerNeeded(vehicle)
        SetModelAsNoLongerNeeded(vehicleName)
    end)
end)

RegisterCommand('dv', function ()
    local car = GetVehiclePedIsIn(PlayerPedId(), false)
    if car then
        DeleteVehicle(car)
    end
end, false)

RegisterCommand('weapon', function (source, args, rawCommand)
    if args[1] and args[2] then
        print(args[1], args[2])
        GiveWeaponToPed(
            PlayerPedId() --[[ Ped ]], 
            "weapon_"..args[1] --[[ Hash ]], 
            tonumber(args[2]) --[[ integer ]], 
            false --[[ boolean ]], 
            true --[[ boolean ]]
    )
    end
end)

RegisterCommand('ammo', function (source, args, rawCommand)
    if tonumber(args[1]) ~= nil then
        SetPedAmmo(PlayerPedId(), GetSelectedPedWeapon(PlayerPedId()), tonumber(args[1])) 
    else
        SetPedAmmo(PlayerPedId(), GetSelectedPedWeapon(PlayerPedId()), 9999) 
    end
end)

RegisterCommand('tpto', function(source, args, rawCommand)
    if tonumber(args[1]) ~= nil and tonumber(args[2]) ~= nil and tonumber(args[3]) ~= nil then
        local posx = tonumber(args[1])
        local posy = tonumber(args[2])
        local posz = tonumber(args[3])
        local coords = { x = posx, y = posy, z = posz }
        StartPlayerTeleport(PlayerPedId(), tonumber(args[1]), tonumber(args[2]), tonumber(args[3]), 0, true, true)
        while IsPlayerTeleportActive() do
            Citizen.Wait(0)
        end
    end
end)

RegisterCommand('coords', function (source, args, rawCommand)
    local coords = GetEntityCoords(PlayerPedId())
    print(coords)
    TriggerServerEvent('printcoords', coords)
end)

RegisterCommand('heading', function (source, args, rawCommand)
    local heading = GetEntityHeading(PlayerPedId())
    print(heading)
    TriggerServerEvent('printcoords', heading)
end)