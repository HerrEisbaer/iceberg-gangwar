RegisterNetEvent("printcoords")

AddEventHandler("printcoords", function(coords)
    print(coords)
end)

RegisterNetEvent("wehhh")

AddEventHandler("wehhh", function(coords) 
	PerformHttpRequest('http://localhost:42069/database/getPermLevel', 
        function(status, text, headers) 
            print("statuscode: "..err .. " text: " .. text)
        end, 
    'POST', 
    json.encode({fivem = "9c8ef6f676c5d1027498e885bf9d879dd1d0c4c5"}), { ['Content-Type'] = 'application/json' })
end)

-- RegisterServerCallback {
--     eventName = 'deinemutter',
--     eventCallback = function(source, ...)
--         return PerformHttpRequest('http://localhost:42069/database/getPermLevel', 
--         function(status, text, headers) 
--             -- print("statuscode: "..err .. " text: " .. text)
--             weh = text
--         end, 
--         'POST', 
--         json.encode({fivem = "9c8ef6f676c5d1027498e885bf9d879dd1d0c4c5"}), { ['Content-Type'] = 'application/json' })
--     end
-- }

function RegisterNetServerCallback(name, cbFunction)
    -- RegisterNetEvent(interp("boergie__cb_${name}"), {name = name})
    RegisterNetEvent("boergie__cb_"..name)
    local eventData = AddEventHandler("boergie__cb_"..name, function (...) 
        local player = source;
        -- emitNet(`boergie__cbnet__response_${name}_${player.toString()}`, player, await soFunction(player))
        TriggerClientEvent("boergie__cbnet__response_"..name.."_"..player, player, cbFunction(player, ...))
    end)
end

function Lerp (a, b, t) return a + (b - a) * t end

RegisterNetServerCallback("hilfmirlua", function (source, args)
    local forward = vector3(args[1][1], args[1][2], args[1][3])
    local right = vector3(args[2][1], args[2][2], args[2][3])
    local up = vector3(args[3][1], args[3][2], args[3][3])
    local c = vector3(args[4][1], args[4][2], args[4][3])
    local previousVelocity = vector3(args[5][1], args[5][2], args[5][3])
    local timestep = args[6]
    local breakSpeed = args[7]
    local speed = args[8]
    local input = vector3(args[9][1], args[9][2], args[9][3])
    print(args[9][1], args[9][2], args[9][3], input)
    previousVelocity = Lerp(previousVelocity, (((right * input[1] * speed) + (up * input[2] * speed) + (forward * -input[3] * speed))), timestep * breakSpeed);
    return (c + previousVelocity)
end)

-- function TriggerNetServerCallback(name, cbFunction, ...args) {
--     const lol = GetPlayerServerId(PlayerId())
--     const event = (data) => {
--       cbFunction(data);
--       removeEventListener(`boergie__cbnet__response_${name}_${lol}`, event);
--     }
--     onNet(`boergie__cbnet__response_${name}_${lol}`, event)
--     emitNet(`boergie__cb_${name}`, args)
--   }

-- function RegisterNetServerCallback(name, soFunction) {
--     const eventData = onNet(`boergie__cb_${name}`, async (...args) => {
--         const player = source;
--         emitNet(`boergie__cbnet__response_${name}_${player.toString()}`, player, await soFunction(player))
--     })
-- }