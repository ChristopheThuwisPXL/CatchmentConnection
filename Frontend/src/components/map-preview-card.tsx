import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Info } from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Fix Leaflet marker icon issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

export function MapPreviewCard() {
  const [position, setPosition] = useState<[number, number] | null>(null);

  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const res = await fetch("http://localhost:5000/getSensorData");
        const data = await res.json();

        const lat = data?.[0]?.location?.latitude;
        const lng = data?.[0]?.location?.longitude;
        if (typeof lat === "number" && typeof lng === "number") {
          setPosition([lat, lng]);
        } else {
          setPosition([51.505, -0.09]); // fallback
        }
      } catch (err) {
        console.error("Error fetching sensor data:", err);
        setPosition([51.505, -0.09]); // fallback
      }
    };

    fetchSensorData();
  }, []);

  return (
    <Card className="md:col-span-2 h-[280px]">
        <CardHeader>
            <div className="flex items-center gap-2">
            <CardTitle>Prototype Location</CardTitle>
            <TooltipProvider>
                <UITooltip>
                <TooltipTrigger asChild>
                    <Info className="w-4 h-4 text-muted-foreground cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent className="bg-popover text-popover-foreground border border-border shadow-lg rounded-md px-4 py-3 text-sm max-w-xs"
                                side="top"
                                sideOffset={8}>
                    <div className="font-medium mb-1 text-foreground">GPS Module</div>
                    <ul className="list-disc ml-4 space-y-1 text-muted-foreground">
                    <li>Uses the GT-U7 GPS Module.</li>
                    <li>Small Receiver with NEO-6M Satellite.</li>
                    <li>Microcontroller for Arduino EEPROM.</li>
                    </ul>
                </TooltipContent>
                </UITooltip>
            </TooltipProvider>
            </div>
            <CardDescription>Based on the onboard GPS module</CardDescription>
        </CardHeader>
      <CardContent className="h-full">
        {position && (
          <MapContainer
            center={position}
            zoom={14}
            scrollWheelZoom={true}
            zoomControl={false}
            className="w-full h-full rounded-md z-0"
          >
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
            />
            <Marker position={position}>
              <Popup>
                Sensor location: [{position?.[0]?.toFixed(5)}, {position?.[1]?.toFixed(5)}]
              </Popup>
            </Marker>
          </MapContainer>
        )}
      </CardContent>
    </Card>
  );
}
