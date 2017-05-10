var s = API.getScreenResolution();
var c = 0;
var p = API.getLocalPlayer();
API.onKeyDown.connect(function (sender, e) {
    let v = API.getPlayerVehicle(p);
    if (API.getEntitySyncedData(p, "user_id") == API.getEntitySyncedData(v, "owner_id")) {
        if (e.KeyCode === Keys.X) {
            API.triggerServerEvent("set_engine_off");
        }
    }
});
API.onUpdate.connect(function () {
    if (API.isPlayerInAnyVehicle(p)) {
        let v = API.getPlayerVehicle(p);

        let plate_veh = API.getVehicleNumberPlate(v);
        let veh_body_health = API.getVehicleHealth(v) / 10;

        let verbrauch = API.returnNative("GET_VEHICLE_ACCELERATION", 7, v) * API.getVehicleRPM(v) / 45.0 * 0.25;
        if (API.getVehicleEngineStatus(v) == false)
            verbrauch = 0;
        let vehicle_fuel = clamp(API.getEntitySyncedData(v, "fuel_level") - verbrauch, 0, 100);

        API.setEntitySyncedData(v, "fuel_level", parseFloat(vehicle_fuel));
        if (vehicle_fuel <= 0)
            API.callNative("SET_VEHICLE_UNDRIVEABLE", v, true);


        let velocity = API.getEntityVelocity(v);
        let speed = Math.sqrt(
            velocity.X * velocity.X +
            velocity.Y * velocity.Y +
            velocity.Z * velocity.Z
        );
        let displaySpeedKmh = Math.round(speed * 1.6 * 2.5);

        drawRct(0.11, 0.932, 0.046, 0.03, 0, 0, 0, 100); // KM/h Anzeige

        drawRct(0.007, 0.808, 0.007, 0.175, 0, 0, 0, 100); // Linker Status Strich Background
        drawRct(0.158, 0.808, 0.007, 0.175, 0, 0, 0, 100); // Rechter Status Strich Background

        // Vehicle Health status Color
        if (veh_body_health > 70) {
            drawRct(0.159, 0.982 - veh_body_health / 580, 0.005, veh_body_health / 580, 0, 255, 0, 100);
        } else if (veh_body_health > 50) {
            drawRct(0.159, 0.982 - veh_body_health / 580, 0.005, veh_body_health / 580, 255, 255, 0, 100);
        } else if (veh_body_health > 20){
            drawRct(0.159, 0.982 - veh_body_health / 580, 0.005, veh_body_health / 580, 255, 0, 0, 100);
        } else {
            if (c > 20 && c < 38) {
                    drawRct(0.159, 0.982 - veh_body_health / 580, 0.005, veh_body_health / 580, 255, 0, 0, 100);
            } else if (c > 39)
                c = 0;
        }

        // Fuel Status Color
        if (vehicle_fuel > 70) {
            drawRct(0.008, 0.982 - vehicle_fuel / 580, 0.005, vehicle_fuel / 580, 0, 255, 0, 100);
        } else if (vehicle_fuel > 50) {
            drawRct(0.008, 0.982 - vehicle_fuel / 580, 0.005, vehicle_fuel / 580, 255, 255, 0, 100);
        } else if (vehicle_fuel > 20) {
            drawRct(0.008, 0.982 - vehicle_fuel / 580, 0.005, vehicle_fuel / 580, 255, 0, 0, 100);
        } else {
            if (c > 20 && c < 38) {
                drawRct(0.008, 0.982 - vehicle_fuel / 580, 0.005, vehicle_fuel / 580, 255, 0, 0, 100);
            } else if (c > 39)
                c = 0;
        }
        c += 1;
        drawRct(0.007, 0.768, 0.0122, 0.037, 0, 0, 0, 150); // Box links oben
        drawRct(0.153, 0.768, 0.0122, 0.037, 0, 0, 0, 150); // Box rechts oben


        drawRct(0.0194, 0.768, 0.028, 0.007, 0, 0, 0, 150); // Linke Gr. Box Oberer Strich
        drawRct(0.0196, 0.776, 0.0275, 0.021, 0, 0, 0, 150); // Linke Gr. Box
        drawRct(0.0194, 0.798, 0.028, 0.007, 0, 0, 0, 150); // Linke Gr. Box Unterer Strich
        drawRct(0.0475, 0.768, 0.004, 0.037, 0, 0, 0, 150); // Linke Gr. Box Rechter Strich


        drawRct(0.1225, 0.768, 0.0306, 0.007, 0, 0, 0, 150); // Rechte Gr. Box Oberer Strich
        drawRct(0.1230, 0.776, 0.0296, 0.021, 0, 0, 0, 150); // Rechte Gr. Box
        drawRct(0.1225, 0.798, 0.0306, 0.007, 0, 0, 0, 150); // Rechte Gr. Box Unterer Strich
        drawRct(0.1185, 0.768, 0.004, 0.037, 0, 0, 0, 150); // Rechte Gr. Box Linker Strich


        drawRct(0.0525, 0.768, 0.065, 0.037, 0, 0, 0, 150); // NamePlate background
        drawTxt(0.0625 + 0.0225, 0.768, 0.55, "~w~" + plate_veh, 255, 255, 255, 255, 1);


        drawTxt(0.135, 0.927, 0.64, "~w~" + Math.ceil(displaySpeedKmh), 255, 255, 255, 255, 2);
        drawTxt(0.155, 0.938, 0.4, "~w~ km/h", 255, 255, 255, 255, 2);

        drawTxt(0.161, 0.766, 0.6, "~w~E", 255, 255, 255, 200, 2); // E
        drawTxt(0.0171, 0.766, 0.6, "~w~F", 255, 255, 255, 200, 2); // F
        drawTxt(0.139, 0.7725, 0.4, "~b~" + Math.ceil(veh_body_health) + "%", 255, 255, 255, 200, 1); // E
        drawTxt(0.035, 0.7725, 0.4, "~b~" + Math.ceil(vehicle_fuel) + "%", 255, 255, 255, 200, 1); // F

    }
});
function drawTxt(x, y, scale, text, r, g, b, a, alignment = 0) {
    API.drawText(
        text,
        parseFloat(x * s.Width),
        parseFloat(y * s.Height),
        parseFloat(scale),
        parseInt(r),
        parseInt(g),
        parseInt(b),
        parseInt(a),
        6,
        alignment,
        true,
        true,
        0);
}
function drawRct(x, y, w, h, r, g, b, a) {
    API.drawRectangle((x * s.Width) - w / 2, (y * s.Height) - h / 2, w * s.Width, h * s.Height, r, g, b, a);
}
function clamp(value, min, max) {
    return Math.max(min, Math.min(value, max))
}