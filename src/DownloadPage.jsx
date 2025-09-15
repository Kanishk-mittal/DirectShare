import React, { useState } from "react";

function DownloadPage() {
    const [magnet, setMagnet] = useState("");
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState("Idle");
    const [files, setFiles] = useState([]);

    // Create WebTorrent client only once
    const client = new window.WebTorrent({
        tracker: true,   // WebSocket trackers
        dht: false,      // DHT not available in browsers
        lsd: true,       // Local network discovery
        webSeeds: true,  // Use HTTP/HTTPS web seeds
        utp: false       // uTP not supported in browsers
    });

    const handleDownload = () => {
        if (!magnet) return alert("Please paste a magnet link");

        setStatus("Fetching torrent metadata...");
        setFiles([]);

        client.add(
            magnet,
            {
                maxWebConns: 2,
                destroyStoreOnDestroy: true,
                storeCacheSlots: 10,
                strategy: "rarest"
            },
            (torrent) => {
                setStatus(`Downloading: ${torrent.name}`);

                // Track progress
                torrent.on("download", () => {
                    setProgress((torrent.progress * 100).toFixed(2));
                });

                // Once metadata is ready, list files but don't auto-download
                const newFiles = torrent.files.map((file) => ({
                    name: file.name,
                    size: file.length,
                    file: file,
                    url: null
                }));
                setFiles(newFiles);

                // Update progress when finished
                torrent.on("done", () => {
                    setStatus(`Download finished: ${torrent.name}`);
                });
            }
        );
    };

    const handleGetUrl = (file) => {
        file.getBlobURL((err, url) => {
            if (err) return console.error(err);

            // Update this file's URL in state
            setFiles((prev) =>
                prev.map((f) =>
                    f.name === file.name ? { ...f, url } : f
                )
            );
        });
    };

    return (
        <div>
            <h2>Download Files</h2>
            <input
                type="text"
                value={magnet}
                onChange={(e) => setMagnet(e.target.value)}
                placeholder="Paste magnet link here"
            />
            <button onClick={handleDownload}>Fetch Torrent</button>

            <div className="status-progress">
                <div><strong>Status:</strong> {status}</div>
                <div><strong>Progress:</strong> {progress}%</div>
            </div>

            <h3>Files in Torrent</h3>
            <ul className="file-list">
                {files.map((f) => (
                    <li key={f.name} className="file-item">
                        <span className="file-info">
                            {f.name}
                            <span className="file-size">
                                ({(f.size / (1024 * 1024)).toFixed(2)} MB)
                            </span>
                        </span>
                        {f.url ? (
                            <a href={f.url} download={f.name} className="download-link">
                                Download
                            </a>
                        ) : (
                            <button onClick={() => handleGetUrl(f.file)} className="get-url-btn">
                                Get URL
                            </button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default DownloadPage;