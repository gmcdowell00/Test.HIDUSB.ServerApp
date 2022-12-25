// Maps foot pedal inputs to value
const map = new Map();
map.set(0, "KEYUP");
map.set(1, "REW");
map.set(2, "PLAY");
map.set(3, "REWPLAY");
map.set(4, "FWD");
map.set(5, "REWFWD");
map.set(6, "FWDPLAY");

// Attach EventListeners when TestHIDComponent is rendered
window.attachHandlers = () => {

    // Get Device Button
    document.getElementById("devices").addEventListener("click", getDevices);

    // Request Device Button
    document.getElementById("request").addEventListener("click", requestDevice);
};

// Log input from HID device
// I'm capturing the HID event in the client and invoking a server-side method. 
// Try binding a server-side variable to the client to invoke the server function directly.
function handleInputReport(e) {
    //console.log(e.device.productName + ": got input report " + e.reportId);
    console.log(new Uint8Array(e.data.buffer));
    let input = new Uint8Array(e.data.buffer);

    // If not KeyUp command log to server. Can change letter. 
    if (input[0] != 0) {

        // Display on Client
        document.getElementById("input").innerHTML = map.get(input[0]);

        // Inovke server-side async method
        DotNet.invokeMethodAsync("Test.HIDUSB.ServerApp", "ReceivedInput", input[0]);
    }        
}

// Get Devices
// HID interface gets a list of the connected HID devices that the user has 
// previously been granted access to in response
// https://developer.mozilla.org/en-US/docs/Web/API/HID/getDevices
async function getDevices() {
    const devices = await navigator.hid.getDevices();    
}

// Request Device
// HID interface requests access to a HID device.
// The user agent will present a permission dialog including a list of connected devices, 
// and ask the user to select and grant permission to one of these devices.
// https://developer.mozilla.org/en-US/docs/Web/API/HID/requestDevice
async function requestDevice () {
    
    if (!document.getElementById('vendor').value || !document.getElementById('product').value) {
        alert('Enter vender and product IDs');
        return;
    }

    let vendor = document.getElementById('vendor').value;
    let product = document.getElementById('product').value;

    // If 'hid' (Web HID API) availible
    if ("hid" in navigator) {

        // Variable
        let device;

        // Start try
        try {

            // Get Requested device matching vendorID and productId
            const devices = await navigator.hid.requestDevice({
                filters: [
                    {
                        vendorId: vendor,
                        productId: product,
                    },
                ],
            });

            // If devices aren't availible
            if (devices.length == 0) {
                alert('No Device Detected');
                return;
            }

            // Grab first device
            device = devices[0];

            // If device is already open
            if (device.opened) {
                console.log(device.productName + " Already opened")
                return;
            }            

            // Open Device and attach report
            devices[0].open().then(() => {
                console.log("Opened device: " + device.productName);
                device.addEventListener("inputreport", handleInputReport);
            });
            
        } catch (error) {
            console.log("An error occurred:" + error.message);
        }

        // Write log
        if (!device) {
            console.log("Request Canceled");
        } else {
            console.log(`HID: ${device.productName}`);
        }
    }
}