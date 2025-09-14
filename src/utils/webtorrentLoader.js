// WebTorrent loader with proper error handling
let WebTorrentClient = null;

export const loadWebTorrent = async () => {
  if (WebTorrentClient) {
    return WebTorrentClient;
  }

  try {
    // Dynamic import to handle module loading issues
    const WebTorrentModule = await import('webtorrent');
    WebTorrentClient = WebTorrentModule.default || WebTorrentModule;
    return WebTorrentClient;
  } catch (error) {
    console.error('Failed to load WebTorrent:', error);
    throw new Error('WebTorrent failed to load. This may be due to browser compatibility issues.');
  }
};

export const createWebTorrentClient = async (options = {}) => {
  try {
    const WebTorrent = await loadWebTorrent();
    
    const defaultOptions = {
      tracker: { 
        wrtc: false // Disable WebRTC to avoid connection issues
      }
    };
    
    const clientOptions = { ...defaultOptions, ...options };
    return new WebTorrent(clientOptions);
  } catch (error) {
    console.error('Failed to create WebTorrent client:', error);
    throw error;
  }
};