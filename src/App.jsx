
import { useState } from 'react';
import UploadPage from './UploadPage';
import DownloadPage from './DownloadPage';

const App = () => {
  const [page, setPage] = useState('upload');

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h1>DirectShare</h1>

      <div style={{
        marginBottom: '1.5rem',
        padding: '10px',
        borderRadius: '8px',
        background: '#f5f5f5'
      }}>
        <div style={{ marginBottom: '5px', fontWeight: 'bold' }}>Select Mode:</div>
        <label style={{
          marginRight: '1.5rem',
          display: 'inline-flex',
          alignItems: 'center',
          cursor: 'pointer'
        }}>
          <input
            type="radio"
            name="page"
            value="upload"
            checked={page === 'upload'}
            onChange={() => setPage('upload')}
            style={{ marginRight: '5px' }}
          />
          Upload File
        </label>
        <label style={{
          display: 'inline-flex',
          alignItems: 'center',
          cursor: 'pointer'
        }}>
          <input
            type="radio"
            name="page"
            value="download"
            checked={page === 'download'}
            onChange={() => setPage('download')}
            style={{ marginRight: '5px' }}
          />
          Download File
        </label>
      </div>

      <div style={{ padding: '10px' }}>
        {page === 'upload' ? <UploadPage /> : <DownloadPage />}
      </div>
    </div>
  );
}

export default App;
