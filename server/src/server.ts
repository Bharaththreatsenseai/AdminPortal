import{ app } from "./index.ts"
import os from 'os';

const PORT = 3000;

const getLocalIP = () => {
  const interfaces = os.networkInterfaces();

  for (const interfaceName of Object.keys(interfaces)) {
    for (const iface of interfaces[interfaceName] || []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }

  return '127.0.0.1'; // fallback to localhost
};
//  Manually set your Wi-Fi IP here
const localIP = getLocalIP();

// Listen on all interfaces
app.listen(PORT, "0.0.0.0", () => {
    console.log(" Server is running:");
    console.log(`Local access  : http://localhost:${PORT}/`);
    console.log(`Wi-Fi access  : http://${localIP}:${PORT}/`);
});