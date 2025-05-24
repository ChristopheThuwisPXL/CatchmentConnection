import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

import L from "leaflet";
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

export function MapPreviewCard() {
  const defaultPosition: [number, number] = [51.505, -0.09];

  return (
    <Card className="md:col-span-2 h-[280px]">
      <CardHeader>
        <CardTitle>Prototype location</CardTitle>
      </CardHeader>
      <CardContent className="h-full">
        <MapContainer
          center={defaultPosition}
          zoom={13}
          scrollWheelZoom={true}
          zoomControl={false}
          className="w-full h-full rounded-md z-0"
        >
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
        />
          <Marker position={defaultPosition}>
            <Popup>Hello from London!</Popup>
          </Marker>
        </MapContainer>
      </CardContent>
    </Card>
  );
}
