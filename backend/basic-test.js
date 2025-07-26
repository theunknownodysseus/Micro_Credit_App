console.log("Step 1: Starting basic test");

try {
    console.log("Step 2: Requiring express");
    const express = require('express');
    console.log("Step 3: Express loaded successfully");

    console.log("Step 4: Creating app");
    const app = express();
    console.log("Step 5: App created successfully");

    console.log("Step 6: Setting up route");
    app.get('/', (req, res) => {
        console.log("Route hit!");
        res.send('Hello World!');
    });
    console.log("Step 7: Route set up successfully");

    console.log("Step 8: Starting server");
    const server = app.listen(5000, () => {
        console.log("SUCCESS: Server is running on port 5000");
    });

    server.on('error', (err) => {
        console.log("Server error:", err);
    });

} catch (error) {
    console.log("ERROR at step:", error.message);
    console.log("Full error:", error);
}