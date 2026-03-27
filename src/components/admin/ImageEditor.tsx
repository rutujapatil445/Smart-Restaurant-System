import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { RotateCcw, RotateCw, Sun, Contrast, Crop, Check, X } from 'lucide-react';

interface ImageEditorProps {
  imageUrl: string;
  onSave: (editedImageUrl: string) => void;
  onCancel: () => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ imageUrl, onSave, onCancel }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: any,
    rotation: number,
    brightness: number,
    contrast: number
  ): Promise<string> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) return '';

    const rotRad = (rotation * Math.PI) / 180;
    const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
      image.width,
      image.height,
      rotation
    );

    canvas.width = bBoxWidth;
    canvas.height = bBoxHeight;

    ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
    ctx.rotate(rotRad);
    ctx.translate(-image.width / 2, -image.height / 2);

    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
    ctx.drawImage(image, 0, 0);

    const data = ctx.getImageData(
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height
    );

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.putImageData(data, 0, 0);

    return new Promise((resolve) => {
      canvas.toBlob((file) => {
        if (file) resolve(URL.createObjectURL(file));
      }, 'image/jpeg');
    });
  };

  const rotateSize = (width: number, height: number, rotation: number) => {
    const rotRad = (rotation * Math.PI) / 180;
    return {
      width:
        Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
      height:
        Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
    };
  };

  const handleSave = async () => {
    try {
      const croppedImage = await getCroppedImg(
        imageUrl,
        croppedAreaPixels,
        rotation,
        brightness,
        contrast
      );
      onSave(croppedImage);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col h-[600px] w-full bg-stone-950 rounded-3xl overflow-hidden border border-stone-800">
      <div className="relative flex-1 bg-stone-900">
        <Cropper
          image={imageUrl}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={4 / 5}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
          style={{
            containerStyle: {
              filter: `brightness(${brightness}%) contrast(${contrast}%)`,
            },
          }}
        />
      </div>

      <div className="p-6 bg-stone-950 border-t border-stone-800 space-y-6">
        <div className="grid grid-cols-2 gap-8">
          {/* Brightness & Contrast */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-stone-400">
                <Sun className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Brightness</span>
              </div>
              <span className="text-[10px] font-mono text-orange-500">{brightness}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              className="w-full accent-orange-600 h-1 bg-stone-800 rounded-full appearance-none cursor-pointer"
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-stone-400">
                <Contrast className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Contrast</span>
              </div>
              <span className="text-[10px] font-mono text-orange-500">{contrast}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              value={contrast}
              onChange={(e) => setContrast(Number(e.target.value))}
              className="w-full accent-orange-600 h-1 bg-stone-800 rounded-full appearance-none cursor-pointer"
            />
          </div>

          {/* Zoom & Rotate */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-stone-400">
                <Crop className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Zoom</span>
              </div>
              <span className="text-[10px] font-mono text-orange-500">{Math.round(zoom * 100)}%</span>
            </div>
            <input
              type="range"
              min="1"
              max="3"
              step="0.1"
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-orange-600 h-1 bg-stone-800 rounded-full appearance-none cursor-pointer"
            />

            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Rotation</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setRotation((r) => r - 90)}
                  className="p-2 bg-stone-900 hover:bg-stone-800 rounded-lg text-stone-400 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setRotation((r) => r + 90)}
                  className="p-2 bg-stone-900 hover:bg-stone-800 rounded-lg text-stone-400 transition-colors"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-2">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest text-stone-500 hover:bg-stone-900 transition-all flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" />
            Discard
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest bg-orange-600 text-white hover:bg-orange-500 transition-all shadow-lg shadow-orange-600/20 flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            Apply Edits
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;
