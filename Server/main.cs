using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GrandTheftMultiplayer.Server.API;
using GrandTheftMultiplayer.Server.Elements;
using GrandTheftMultiplayer.Shared;
using GrandTheftMultiplayer.Server.Managers;

namespace spl_vehicleui.Server
{
    class main : Script
    {
        public main()
        {
            API.onPlayerEnterVehicle += API_onPlayerEnterVehicle;
            API.onClientEventTrigger += API_onClientEventTrigger;
        }

        private void API_onClientEventTrigger(Client sender, string eventName, params object[] arguments)
        {
            if(sender.vehicle.getSyncedData("owner_id") == sender.getSyncedData("user_id"))
            switch (eventName)
            {
                case "set_engine_off":
                    sender.vehicle.engineStatus = !sender.vehicle.engineStatus;
                    break;
                default:
                    break;
            }
        }

        [Command]
        public void setfuel(Client p, float level)
        {
            API.setEntitySyncedData(p.vehicle, "fuel_level", level);
        }
        [Command]
        public void dmg(Client p, float dmg)
        {
            API.setVehicleHealth(p.vehicle, dmg);
        }
        [Command]
        public void engine(Client p, bool t)
        {
            API.setVehicleEngineStatus(p.vehicle, t);
        }
        [Command]
        public void fuel(Client p)
        {
            var fuel = API.getEntitySyncedData(p.vehicle, "fuel_level");
            API.sendChatMessageToPlayer(p, fuel.ToString());
        }

        private void API_onPlayerEnterVehicle(Client player, NetHandle vehicle)
        {
            if(API.getEntitySyncedData(vehicle, "fuel_level") == null)
                API.setEntitySyncedData(vehicle, "fuel_level", 100.0f);
        }
    }
}
