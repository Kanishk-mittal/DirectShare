// src/DownloadPage.js
import React, { useState, useEffect } from "react";
import WebTorrent from "webtorrent";

function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
}

export default function DownloadPage() {
    const [client, setClient] = useState(null);
    const [magnetURI, setMagnetURI] = useState("");
    const [torrentObj, setTorrentObj] = useState(null);
    const [files, setFiles] = useState([]);
    const [progress, setProgress] = useState("");
    const [savingIndex, setSavingIndex] = useState(null);
    
    useEffect(() => {
        // Initialize WebTorrent client when component mounts
        const webTorrentClient = new WebTorrent({
            tracker: { wrtc: false } // Disable WebRTC to avoid connection issues
        });
        
        setClient(webTorrentClient);
        
        // Clean up when component unmounts
        return () => {
            if (webTorrentClient) {
                try {
                    webTorrentClient.destroy();
                } catch (err) {
                    console.error("Error destroying WebTorrent client:", err);
                }
            }
        };
    }, []);

    const handleDownload = () => {
        if (!magnetURI || !client) return;
        
        try {
            // add the torrent (it will start downloading/seeding as peers appear)
            const t = client.add(magnetURI, (torrent) => {
                setTorrentObj(torrent);
                setFiles(torrent.files || []);
            });

            t.on("download", () => {
                setProgress((t.progress * 100).toFixed(2) + "%");
            });

            t.on("done", () => {
                setProgress("100.00% (done)");
                setFiles(t.files || []);
            });

            t.on("error", (err) => {
                console.error("Torrent error:", err);
            });
        } catch (error) {
            console.error("Error adding torrent:", error);
            setProgress("Error: " + error.message);
        }
    };

    // Robust save: try getBlob -> getBuffer -> createReadStream
    const handleSave = async (file, index) => {
        setSavingIndex(index);
        try {
            // 1) browser helper (if available)
            if (typeof file.getBlob === "function") {
                const blob = await new Promise((res, rej) =>
                    file.getBlob((err, b) => (err ? rej(err) : res(b)))
                );
                downloadBlob(blob, file.name);
                return;
            }

            // 2) node-style getBuffer (returns a Buffer)
            if (typeof file.getBuffer === "function") {
                const buffer = await new Promise((res, rej) =>
                    file.getBuffer((err, buf) => (err ? rej(err) : res(buf)))
                );
                // Buffer might be Node Buffer; create Uint8Array
                const uint8 =
                    typeof Uint8Array !== "undefined" && buffer instanceof Uint8Array
                        ? buffer
                        : new Uint8Array(buffer);
                const blob = new Blob([uint8], { type: file.type || "" });
                downloadBlob(blob, file.name);
                return;
            }

            // 3) stream fallback (createReadStream)
            if (typeof file.createReadStream === "function") {
                const chunks = [];
                await new Promise((resolve, reject) => {
                    const stream = file.createReadStream();
                    stream.on("data", (chunk) => {
                        // chunk might be Buffer, Uint8Array, or ArrayBuffer
                        if (typeof Buffer !== "undefined" && Buffer.isBuffer(chunk)) {
                            chunks.push(new Uint8Array(chunk));
                        } else if (chunk instanceof ArrayBuffer) {
                            chunks.push(new Uint8Array(chunk));
                        } else if (chunk instanceof Uint8Array) {
                            chunks.push(chunk);
                        } else {
                            // fallback: try to create Uint8Array
                            try {
                                chunks.push(new Uint8Array(chunk));
                            } catch (e) {
                                console.warn("Unknown chunk type, skipping", e);
                            }
                        }
                    });
                    stream.on("end", resolve);
                    stream.on("error", reject);
                });

                const blob = new Blob(chunks, { type: file.type || "" });
                downloadBlob(blob, file.name);
                return;
            }

            throw new Error(
                "No supported file access method found on torrent file object."
            );
        } catch (err) {
            console.error("Save failed:", err);
            alert("Download failed: " + (err && err.message ? err.message : err));
        } finally {
            setSavingIndex(null);
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>Download</h2>

            <div style={{ marginBottom: 10 }}>
                <input
                    type="text"
                    placeholder="Paste magnet URI"
                    value={magnetURI}
                    onChange={(e) => setMagnetURI(e.target.value)}
                    style={{ width: "75%", marginRight: 8 }}
                />
                <button onClick={handleDownload}>Add</button>
            </div>

            <div style={{ marginBottom: 10 }}>
                <strong>Progress:</strong> {progress}
            </div>

            <div>
                <h3>Files</h3>
                {files.length === 0 && <div>No files yet. Add a magnet URI.</div>}
                {files.map((file, idx) => (
                    <div
                        key={idx}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            marginBottom: 8,
                        }}
                    >
                        <div style={{ flex: 1 }}>{file.name}</div>
                        <div>
                            <button
                                onClick={() => handleSave(file, idx)}
                                disabled={savingIndex !== null}
                            >
                                {savingIndex === idx ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
