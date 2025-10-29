A locally hosted web-based tool that is designed to remove white backgrounds from JPGs and automatically convert image files to transparent PNGs.

Node.js is required to run the application. The following command prompts need to be run in advance of operation:

npm init -y / npm install express multer sharp / npm start

Key Features of the Image Compressor / Resizer (v1) are listed below:

• Removes white or near-white backgrounds by analysing each pixel and making them fully transparent
• Converts images to PNG format while preserving the original dimensions (no resizing)
• Saves images at maximum quality (no compression)
• Processes up to 50 images at once
• Returns download URLs in the same way as the Image Compressor & Resizer

How to Use:

• Copy the file onto your desktop
• Open the file in Terminal
• Run the command npm start
• Then copy http://localhost:3000 into your browser while keeping the terminal active
• Upload the JPG and hit Remove Background
