// For local testing (emulator/simulator): use localhost or 127.0.0.1
// For physical device: use your computer's local IP address
// Your IP addresses: 10.217.99.219 or 192.168.56.1
// To find your IP: Windows: ipconfig | findstr IPv4 | Mac/Linux: ifconfig or ip addr

// For Android Emulator: use 10.0.2.2 instead of localhost
// For iOS Simulator: use localhost
// For Physical Device: use your computer's IP (10.217.99.219)

export const API_BASE_URL = 'http://10.217.99.219:8000';
// Alternative options:
// export const API_BASE_URL = 'http://localhost:8000'; // For iOS Simulator
// export const API_BASE_URL = 'http://10.0.2.2:8000'; // For Android Emulator
// export const API_BASE_URL = 'http://192.168.56.1:8000'; // Alternative IP