# Story 2.3: Advanced Sender Features & Mobile Gestures

## User Story

**As a** usuário,
**I want** funcionalidades avançadas de alternância de remetente,
**So that** posso criar conversas de forma ainda mais eficiente.

## Story Context

**Building Upon:** Story 2.1 MessageInput já implementa basic toggle
**Enhancement Focus:** Adicionar features avançadas não implementadas
**Technology:** React Touch events, localStorage preferences, advanced animations
**Current Status:** Basic toggle (Tab key + button) implemented in MessageInput.tsx

## Acceptance Criteria

### Mobile Enhancement

1. **Swipe gestures** na área do input para alternar remetente
2. **Long press** no botão toggle para configurações rápidas
3. **Haptic feedback** em dispositivos compatíveis (opcional)

### Advanced Settings

4. **Auto-toggle preference** configurável e persistida
5. **Configuração de shortcuts** personalizáveis pelo usuário
6. **Visual themes** para diferentes senders (cores personalizáveis)

### Developer Experience

7. **Enhanced testing** para touch interactions
8. **Performance monitoring** para gestures
9. **Accessibility improvements** para screen readers

## Dev Notes

**Current Implementation Status:**

- ✅ Tab toggle: implementado em MessageInput.tsx:56-59
- ✅ Visual button: implementado em MessageInput.tsx:82-98
- ✅ Sender indicator: implementado em MessageInput.tsx:197-200

**Files to Create/Modify:**

- `/src/hooks/useGestures.ts` - Custom hook for touch gestures
- `/src/hooks/useSenderPreferences.ts` - Preference management
- `/src/components/chat/MessageInput/MessageInput.tsx` - Add gesture support
- `/src/utils/gestures.ts` - Touch gesture utilities
- `/src/types/preferences.ts` - Type definitions for user preferences

**ChatContext Integration:**

- Add missing `toggleSender` method to ChatContext actions
- Use existing `setActiveSender` for base functionality
- Enhance with gesture and preference capabilities

**Testing Strategy:**

- Mock touch events with @testing-library/react
- Test localStorage persistence with jest-localstorage-mock
- Validate gesture recognition accuracy (swipe direction/distance)
- Accessibility testing with screen readers and keyboard navigation
- Performance testing for gesture responsiveness

## Technical Implementation Details

**TouchEvent Integration:**

```typescript
// Touch gesture handling pattern
const handleTouchStart = (e: React.TouchEvent) => {
  // Record initial touch position and timestamp
};
const handleTouchMove = (e: React.TouchEvent) => {
  // Track movement for swipe detection
};
const handleTouchEnd = (e: React.TouchEvent) => {
  // Process gesture and trigger action if valid swipe
};
```

**Preference Persistence Schema:**

```typescript
interface SenderPreferences {
  autoToggle: boolean;
  customShortcuts: string[];
  senderColors: { user: string; contact: string };
  gesturesEnabled: boolean;
  swipeThreshold: number;
}
```

**Animation Specifications:**

- Swipe feedback: 150ms ease-out transition
- Color theme changes: 200ms fade transition
- Haptic feedback: light impact on iOS, vibrate(50) on Android

## Definition of Done

- ✅ **Swipe gestures** working on touch devices
- ✅ **Long press** configurações implementadas
- ✅ **Preferences** persistidas em localStorage
- ✅ **Enhanced testing** suite implementada
- ✅ **Accessibility** melhorias validadas
- ✅ **Performance** otimizada para gestures
- ✅ **Missing toggleSender** method added to ChatContext
- ✅ **Mobile haptic feedback** implementado (opcional)

## Risk and Compatibility Check

**Minimal Risk Assessment:**

- **Primary Risk:** Touch events podem interferir com scroll nativo
- **Mitigation:** Gestão cuidadosa de preventDefault(), swipe threshold tuning
- **Rollback:** Disable gestures, manter funcionalidade básica existente

**Compatibility Verification:**

- ✅ **No breaking changes:** Builds upon existing MessageInput implementation
- ✅ **Browser compatibility:** Touch events suportados por target browsers
- ✅ **Performance impact:** Gesture detection otimizada, debounced
- ✅ **Accessibility:** Mantém keyboard navigation + screen reader support

---

_Epic 2: Message Management & Editing_  
_Story 2.3 revisada pelo John (PM) - 22/08/2025_
_Original story redefined based on architectural analysis_
