import React, { useState } from "react";

const client = new window.WebTorrent({
    tracker: true,   // WebSocket trackers
    dht: false,      // DHT not available in browsers
    lsd: true,       // Local network discovery
    webSeeds: true,  // Use HTTP/HTTPS web seeds
    utp: false       // uTP not supported in browsers
});

function UploadPage() {
    const [magnetLink, setMagnetLink] = useState("");

    const handleUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        client.seed(file, {
            announce: [
                "wss://tracker.openwebtorrent.com",
                "wss://tracker.btorrent.xyz",
                "wss://tracker.fastcast.nz",
                "wss://tracker.webtorrent.io"
            ]
        }, (torrent) => {
            console.log("Seeding:", torrent.infoHash);
            setMagnetLink(torrent.magnetURI);
        });
    };

    return (
        <div>
            <h2>Upload & Share</h2>
            <input type="file" onChange={handleUpload} />
            {magnetLink && (
                <div>
                    <p><strong>Magnet Link:</strong></p>
                    <textarea value={magnetLink} readOnly rows="4" />
                </div>
            )}
        </div>
    );
}

export default UploadPage;
