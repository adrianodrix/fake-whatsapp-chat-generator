/**
 * Utilitários para processamento de imagem
 */

export interface ResizeResult {
  dataUrl: string;
  processingTime: number;
}

export interface ResizeOptions {
  size: number;
  quality: number;
}

const DEFAULT_OPTIONS: ResizeOptions = {
  size: 40,
  quality: 0.8,
};

/**
 * Verifica se o Canvas API está disponível
 */
export function isCanvasSupported(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext && canvas.getContext('2d'));
  } catch {
    return false;
  }
}

/**
 * Redimensiona imagem para avatar usando Canvas API
 */
export async function resizeImageToAvatar(
  file: File,
  options: Partial<ResizeOptions> = {}
): Promise<ResizeResult> {
  const startTime = performance.now();
  const { size, quality } = { ...DEFAULT_OPTIONS, ...options };

  return new Promise((resolve, reject) => {
    // Fallback se Canvas não estiver disponível
    if (!isCanvasSupported()) {
      const reader = new FileReader();
      reader.onload = () => {
        const endTime = performance.now();
        resolve({
          dataUrl: reader.result as string,
          processingTime: endTime - startTime,
        });
      };
      reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
      reader.readAsDataURL(file);
      return;
    }

    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          throw new Error('Erro ao criar contexto Canvas');
        }

        // Define tamanho do canvas
        canvas.width = size;
        canvas.height = size;

        // Calcula dimensões para crop quadrado
        const minDimension = Math.min(img.width, img.height);
        const sx = (img.width - minDimension) / 2;
        const sy = (img.height - minDimension) / 2;

        // Desenha imagem redimensionada
        ctx.drawImage(
          img,
          sx,
          sy,
          minDimension,
          minDimension,
          0,
          0,
          size,
          size
        );

        // Converte para DataURL
        const dataUrl = canvas.toBlob
          ? new Promise<string>((res) => {
              canvas.toBlob(
                (blob) => {
                  if (blob) {
                    const reader = new FileReader();
                    reader.onload = () => res(reader.result as string);
                    reader.readAsDataURL(blob);
                  } else {
                    res(canvas.toDataURL('image/jpeg', quality));
                  }
                },
                'image/jpeg',
                quality
              );
            })
          : Promise.resolve(canvas.toDataURL('image/jpeg', quality));

        dataUrl.then((url) => {
          const endTime = performance.now();
          resolve({
            dataUrl: url,
            processingTime: endTime - startTime,
          });
        });
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => reject(new Error('Erro ao carregar imagem'));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Cria avatar com iniciais quando não há imagem
 */
export function generateInitialsAvatar(name: string): string {
  const initials = name
    .split(' ')
    .map((word) => word.charAt(0))
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const canvas = document.createElement('canvas');
  const size = 40;
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background
  ctx.fillStyle = '#075E54'; // cor do WhatsApp
  ctx.fillRect(0, 0, size, size);

  // Texto
  ctx.fillStyle = 'white';
  ctx.font = '16px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(initials, size / 2, size / 2);

  return canvas.toDataURL();
}
