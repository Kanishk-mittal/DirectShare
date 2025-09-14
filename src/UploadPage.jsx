import React, { useState, useEffect } from "react";
import WebTorrent from "webtorrent";

function UploadPage() {
    const [client, setClient] = useState(null);
    const [magnetLink, setMagnetLink] = useState("");
    
    useEffect(() => {
        // Initialize WebTorrent client when component mounts
        const webTorrentClient = new WebTorrent({
            tracker: { wrtc: false } // Disable WebRTC to avoid connection issues
        });
        
        setClient(webTorrentClient);
        
        // Clean up when component unmounts
        return () => {
            if (webTorrentClient) {
                webTorrentClient.destroy();
            }
        };
    }, []);

    const handleUpload = (e) => {
        const file = e.target.files[0];
        if (!file || !client) return;

        try {
            client.seed(file, (torrent) => {
                console.log("Seeding:", torrent.infoHash);
                setMagnetLink(torrent.magnetURI);
            });
        } catch (error) {
            console.error("Error seeding file:", error);
        }
    };

    return (
        <div>
            <h2>Upload & Share</h2>
            <input type="file" onChange={handleUpload} />
            {magnetLink && (
                <div>
                    <p><strong>Magnet Link:</strong></p>
                    <textarea value={magnetLink} readOnly rows="3" cols="80" />
                </div>
            )}
        </div>
    );
}

export default UploadPage;
