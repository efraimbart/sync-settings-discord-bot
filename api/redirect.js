import express from 'express';

// Create an express app
const app = express();

// Get port, or default to 3000
const PORT = process.env.PORT || 3000;

app.get('/api/setting/:setting', async function (req, res) {
    return res.redirect(301, `sync-settings://${req.params.setting}`)
})

  
app.listen(PORT, () => {
    console.log('Listening on port', PORT);
});