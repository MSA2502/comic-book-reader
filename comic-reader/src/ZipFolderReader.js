import React, { useState } from 'react';
import JSZip from 'jszip';
import NavButton from './NavButton';

function ZipFolderReader() {
  const [fileContent, setFileContent] = useState([]);
  const [zipFileName, setZipFileName] = useState('');
  const [currentSpread, setCurrentSpread] = useState(0);
  const [colorMode, setColorMode] = useState('light');
  const [errorMessage, setErrorMessage] = useState('');

  const backgroundStyles = {
    light: '#f5f5f5',
    dark: '#1a1a1a',
    sepia: '#f4ecd8',
  };

  const handleFileOpen = async () => {
    try {
      setErrorMessage('');

      const [fileHandle] = await window.showOpenFilePicker({
        types: [
          {
            description: 'CBZ/ZIP Files',
            accept: { 'application/zip': ['.zip', '.cbz'] },
          },
        ],
        excludeAcceptAllOption: true,
        multiple: false,
      });

      const file = await fileHandle.getFile();
      const arrayBuffer = await file.arrayBuffer();
      const zip = await JSZip.loadAsync(arrayBuffer);
      const files = Object.keys(zip.files);

      const filePromises = files.map(async (fileName) => {
        const fileData = await zip.files[fileName].async('blob');
        const url = URL.createObjectURL(fileData);
        return { fileName, url, fileData };
      });

      const fileContents = await Promise.all(filePromises);

      const images = fileContents
        .filter(f => /\.(jpg|jpeg|png|gif|bmp|svg)$/i.test(f.fileName))
        .sort((a, b) =>
          a.fileName.localeCompare(b.fileName, undefined, { numeric: true })
        );

      if (!images.length) {
        setErrorMessage('No images found in the CBZ/ZIP file.');
        setFileContent([]);
        return;
      }

      setFileContent(images);
      setCurrentSpread(0);
      setZipFileName(file.name);
    } catch (error) {
      console.error('Error reading file:', error);
      setErrorMessage('Failed to open file. Please select a valid CBZ/ZIP file.');
      setFileContent([]);
    }
  };

  const handleNext = () => {
    if ((currentSpread + 1) * 2 < fileContent.length) setCurrentSpread(currentSpread + 1);
  };

  const handlePrev = () => {
    if (currentSpread > 0) setCurrentSpread(currentSpread - 1);
  };

  return (
    <div
      style={{
        backgroundColor: backgroundStyles[colorMode],
        minHeight: '100vh',
        padding: '20px',
        transition: 'background-color 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Open File button */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: fileContent.length === 0 ? '100vh' : 'auto',
          marginBottom: fileContent.length === 0 ? '0' : '20px',
        }}
      >
        <button
          onClick={handleFileOpen}
          style={{
            padding: fileContent.length === 0 ? '20px 40px' : '10px 20px',
            fontSize: fileContent.length === 0 ? '20px' : '16px',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          {fileContent.length === 0 ? 'Open CBZ File' : 'Open A Comic'}
        </button>
      </div>

      {/* Color mode buttons */}
      {fileContent.length > 0 && (
        <div style={{ marginBottom: '10px' }}>
          <button onClick={() => setColorMode('light')} style={{ margin: '0 5px', padding: '10px 20px', fontSize: '16px', border: "2px solid #000000ff" }}>Light</button>
          <button onClick={() => setColorMode('dark')} style={{ margin: '0 5px', padding: '10px 20px', fontSize: '16px', border: "2px solid #000000ff" }}>Dark</button>
          <button onClick={() => setColorMode('sepia')} style={{ margin: '0 5px', padding: '10px 20px', fontSize: '16px', border: "2px solid #000000ff" }}>Sepia</button>
        </div>
      )}

      {/* Error message */}
      {errorMessage && <p style={{ color: 'red', marginBottom: '20px' }}>{errorMessage}</p>}

      {/* Comic content with arrows */}
      {fileContent.length > 0 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '30px',
          }}
        >
          {/* Comic container with fit-to-height adjustment */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              maxWidth: '90vw',
              maxHeight: '90vh',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {/* Prev button only if left page exists */}
            {fileContent[currentSpread * 2] && (
              <NavButton
                onClick={handlePrev}
                disabled={currentSpread === 0}
                side="left"
              >
                &#8592;
              </NavButton>
            )}

            {[0, 1].map((offset) => {
              const page = fileContent[currentSpread * 2 + offset];
              return (
                page && (
                  <img
                    key={page.fileName}
                    src={page.url}
                    alt={page.fileName}
                    style={{
                      maxWidth: '45vw',
                      maxHeight: '90vh',
                      width: 'auto',
                      height: 'auto',
                      objectFit: 'contain',
                    }}
                  />
                )
              );
            })}

            {/* Next button only if right page exists */}
            {fileContent[currentSpread * 2 + 1] && (
              <NavButton
                onClick={handleNext}
                disabled={(currentSpread + 1) * 2 >= fileContent.length}
                side="right"
              >
                &#8594;
              </NavButton>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ZipFolderReader;
