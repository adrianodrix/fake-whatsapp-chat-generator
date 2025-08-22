# Security and Privacy Considerations

## Client-Side Security Framework

### Upload Security Validation

#### File Type Validation (Defense in Depth)

```typescript
// src/utils/validation.ts

// 1. MIME Type Validation
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// 2. File Signature Verification (Magic Numbers)
const FILE_SIGNATURES = {
  jpeg: [0xff, 0xd8, 0xff],
  png: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
  webp: [0x52, 0x49, 0x46, 0x46], // RIFF + WEBP check
};

// 3. Complete Validation with Signature Check
export async function validateUploadFileComplete(
  file: File
): Promise<ValidationResult> {
  // Basic validations first
  const basicValidation = validateUploadFile(file);
  if (!basicValidation.isValid) return basicValidation;

  // File signature verification (prevents spoofing attacks)
  const signatureValidation = await validateFileSignature(file);
  return signatureValidation;
}
```

#### Security Features Implemented:

- ✅ **MIME Type Validation**: Only image/jpeg, image/png, image/webp allowed
- ✅ **File Size Limits**: Maximum 10MB per upload
- ✅ **File Signature Verification**: Magic number validation prevents spoofing
- ✅ **Filename Sanitization**: Removes dangerous characters and control sequences
- ✅ **Performance Optimized**: Reads only first 12 bytes for signature check

### Input Sanitization

```typescript
// Enhanced XSS Prevention
export function sanitizeString(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Filename Security
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[<>:"/\\|?*]/g, '') // Remove dangerous characters
    .replace(/[\n\r\t]/g, '_') // Replace newlines/tabs
    .replace(/[\x00-\x1f\x80-\x9f]/g, '') // Remove control chars
    .replace(/^\.+/, '') // Remove leading dots
    .replace(/\.+$/, '') // Remove trailing dots
    .replace(/\s+/g, '_') // Replace spaces
    .substring(0, 255); // Limit length
}
```

### Security Testing

Comprehensive test coverage for malicious scenarios:

- ✅ **MIME Type Spoofing**: Files with fake MIME types
- ✅ **Script Injection**: JavaScript masked as images
- ✅ **Executable Files**: .exe/.bat files with image extensions
- ✅ **Invalid Headers**: Corrupted or malformed file signatures
- ✅ **Performance Validation**: Security checks under 50ms

### Privacy Implementation

- **No Server Communication:** Todo processamento client-side
- **No Data Collection:** Nenhum dado pessoal coletado ou transmitido
- **Local Storage Only:** Dados persistem apenas localmente
- **Secure Canvas Processing:** Export sem upload de dados
