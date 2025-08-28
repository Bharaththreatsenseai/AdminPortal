// admin.ts
import axios  from 'axios';

async function sendCommand() {
  const update = {
    AgentCam: false,     //true disables the camera functionality
    AgentSnip: false,   //true disables the sniptool and screenshot functionality
    AgentStorage:false, //true disables the pendrive asks password when connected to client device
    AgentInput:false,    // true make sure that mouse and keyboard runs successfully with out any interuptions
    AgentPortable:false, //true disable Mobiles connectivity
  };
  
  try {
    const res = await axios.post("http://localhost:3000/admin", update);
    console.log(" Server response:", res.data);
  } catch (err) {
    console.error(" Error sending command:", err);
  }
}

sendCommand();
