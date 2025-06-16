import { useState } from 'react';
import { BACKEND } from '@/config';

export default function Home() {
  const [original, setOriginal] = useState(null);
  const [compressed, setCompressed] = useState(null);
  const [scale, setScale] = useState(100);
  const [quality, setQuality] = useState(60);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    const img = new Image();
    img.src = imageUrl;

    img.onload = async () => {
      setLoading(true);
      const formData = new FormData();
      formData.append('image', file);
      formData.append('scale', scale);
      formData.append('quality', quality);

      try {
        const res = await fetch(`${BACKEND}/api/compress`, {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();

        setOriginal({
          name: file.name,
          size: (file.size / 1024).toFixed(2),
          width: img.width,
          height: img.height,
          preview: imageUrl,
        });

        setCompressed({
          ...data,
          preview: data.url,
        });
      } catch (err) {
        alert('Upload failed!');
      } finally {
        setLoading(false);
      }
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-white py-10 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-indigo-700 mb-4">📦 Image Compressor</h1>
        <p className="text-gray-600 mb-8">Resize and compress your image by percentage and quality.</p>

        <div className="grid md:grid-cols-2 gap-4 max-w-xl mx-auto mb-6">
          <input
            type="number"
            placeholder="Resize % (e.g. 50)"
            className="p-3 border rounded w-full"
            value={scale}
            onChange={(e) => setScale(e.target.value)}
            min={1}
            max={100}
          />
          <input
            type="number"
            placeholder="Quality (1–100)"
            className="p-3 border rounded w-full"
            value={quality}
            onChange={(e) => setQuality(e.target.value)}
            min={1}
            max={100}
          />
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="mb-8 block w-full max-w-md mx-auto file:px-4 file:py-2 file:border-0 file:rounded file:bg-indigo-600 file:text-white file:cursor-pointer hover:file:bg-indigo-700"
        />

        {loading && (
          <div className="text-center text-indigo-600 font-semibold mt-4 mb-6">Compressing image...</div>
        )}

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {original && (
            <div className="bg-white p-6 rounded-lg shadow-md border">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Original Image</h2>
              <img
                src={original.preview}
                alt="Original"
                className="w-full h-60 object-contain rounded mb-4 border"
              />
              <p><strong>Name:</strong> {original.name}</p>
              <p><strong>Size:</strong> {original.size} KB</p>
              <p><strong>Dimensions:</strong> {original.width} x {original.height}</p>
            </div>
          )}

          {compressed && (
            <div className="bg-white p-6 rounded-lg shadow-md border">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Compressed Image</h2>
              <img
                src={compressed.preview}
                alt="Compressed"
                className="w-full h-60 object-contain rounded mb-4 border"
              />
              <p><strong>Size:</strong> {compressed.size} KB</p>
              <p><strong>Dimensions:</strong> {compressed.width} x {compressed.height}</p>
              <a
                href={compressed.url}
                download
                className="mt-4 inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
              >
                ⬇️ Download Compressed
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
