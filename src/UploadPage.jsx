import React, { useState, useEffect } from "react";
import { createWebTorrentClient } from "./utils/webtorrentLoader";

function UploadPage() {
    const [client, setClient] = useState(null);
    const [magnetLink, setMagnetLink] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;
        
        const initializeClient = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const webTorrentClient = await createWebTorrentClient();
                
                if (mounted) {
                    setClient(webTorrentClient);
                    setLoading(false);
                }
            } catch (err) {
                console.error("Failed to initialize WebTorrent client:", err);
                if (mounted) {
                    setError(err.message);
                    setLoading(false);
                }
            }
        };

        initializeClient();

        // Clean up when component unmounts
        return () => {
            mounted = false;
            if (client) {
                try {
                    client.destroy();
                } catch (err) {
                    console.error("Error destroying WebTorrent client:", err);
                }
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
            setError("Failed to seed file: " + error.message);
        }
    };

    if (loading) {
        return (
            <div>
                <h2>Upload & Share</h2>
                <p>Loading WebTorrent client...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <h2>Upload & Share</h2>
                <div style={{ color: 'red', marginBottom: '10px' }}>
                    <strong>Error:</strong> {error}
                </div>
                <p>WebTorrent functionality is currently unavailable.</p>
            </div>
        );
    }

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
