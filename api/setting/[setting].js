export default function setting(req, res) {
    const { setting } = req.query;

    res.redirect(301, `sync-settings://${setting}`)  
}