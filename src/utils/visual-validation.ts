/**
 * Sistema de validação visual para autenticidade WhatsApp
 * Implementa verificações de cores, layout e pixel-perfect matching
 */

import React from 'react';

interface ColorValidation {
  element: string;
  expected: string;
  actual: string;
  isValid: boolean;
  difference: number;
}

interface LayoutValidation {
  element: string;
  property: string;
  expected: number;
  actual: number;
  isValid: boolean;
  tolerance: number;
}

interface VisualValidationResult {
  isValid: boolean;
  score: number;
  colorValidations: ColorValidation[];
  layoutValidations: LayoutValidation[];
  errors: string[];
  warnings: string[];
}

/**
 * Validador visual para componentes WhatsApp
 */
export class WhatsAppVisualValidator {
  private readonly colorTargets = {
    header: '#075E54',
    'chat-bg': '#E5DDD5',
    'bubble-sent': '#DCF8C6',
    'bubble-received': '#FFFFFF',
    'text-primary': '#000000',
    'text-secondary': '#667781',
    'text-meta': '#8696A0',
    'check-default': '#919191',
    'check-read': '#4FC3F7',
  };

  private readonly layoutTargets = {
    'header-height': 60,
    'bubble-max-width': 65,
    'input-padding': 12,
    'message-spacing': 4,
  };

  /**
   * Executa validação completa da interface
   */
  async validateInterface(
    container: HTMLElement
  ): Promise<VisualValidationResult> {
    const colorValidations = await this.validateColors(container);
    const layoutValidations = await this.validateLayout(container);

    const errors: string[] = [];
    const warnings: string[] = [];

    // Analisar resultados
    colorValidations.forEach((validation) => {
      if (!validation.isValid) {
        if (validation.difference > 10) {
          errors.push(
            `Cor ${validation.element} muito diferente: esperado ${validation.expected}, obtido ${validation.actual}`
          );
        } else {
          warnings.push(
            `Pequena diferença na cor ${validation.element}: ${validation.difference.toFixed(2)}% diferença`
          );
        }
      }
    });

    layoutValidations.forEach((validation) => {
      if (!validation.isValid) {
        errors.push(
          `Layout ${validation.element}.${validation.property}: esperado ${validation.expected}px, obtido ${validation.actual}px`
        );
      }
    });

    // Calcular score geral
    const totalValidations = colorValidations.length + layoutValidations.length;
    const passedValidations =
      colorValidations.filter((v) => v.isValid).length +
      layoutValidations.filter((v) => v.isValid).length;
    const score =
      totalValidations > 0 ? (passedValidations / totalValidations) * 100 : 0;

    return {
      isValid: errors.length === 0,
      score,
      colorValidations,
      layoutValidations,
      errors,
      warnings,
    };
  }

  /**
   * Valida cores dos elementos
   */
  private async validateColors(
    container: HTMLElement
  ): Promise<ColorValidation[]> {
    const validations: ColorValidation[] = [];

    for (const [elementKey, expectedColor] of Object.entries(
      this.colorTargets
    )) {
      const element = this.findElementByRole(container, elementKey);
      if (!element) {
        validations.push({
          element: elementKey,
          expected: expectedColor,
          actual: 'not-found',
          isValid: false,
          difference: 100,
        });
        continue;
      }

      const computedStyle = getComputedStyle(element);
      const actualColor = this.getRelevantColor(computedStyle, elementKey);
      const difference = this.calculateColorDifference(
        expectedColor,
        actualColor
      );

      validations.push({
        element: elementKey,
        expected: expectedColor,
        actual: actualColor,
        isValid: difference < 5, // 5% tolerance
        difference,
      });
    }

    return validations;
  }

  /**
   * Valida layout e dimensões
   */
  private async validateLayout(
    container: HTMLElement
  ): Promise<LayoutValidation[]> {
    const validations: LayoutValidation[] = [];

    for (const [layoutKey, expectedValue] of Object.entries(
      this.layoutTargets
    )) {
      const element = this.findElementByRole(
        container,
        layoutKey.split('-')[0]
      );
      if (!element) {
        validations.push({
          element: layoutKey,
          property: 'existence',
          expected: 1,
          actual: 0,
          isValid: false,
          tolerance: 0,
        });
        continue;
      }

      const actualValue = this.getLayoutValue(element, layoutKey);
      const tolerance = this.getLayoutTolerance(layoutKey);

      validations.push({
        element: layoutKey,
        property: layoutKey.split('-')[1] || 'dimension',
        expected: expectedValue,
        actual: actualValue,
        isValid: Math.abs(actualValue - expectedValue) <= tolerance,
        tolerance,
      });
    }

    return validations;
  }

  /**
   * Encontra elemento por role/função
   */
  private findElementByRole(
    container: HTMLElement,
    role: string
  ): HTMLElement | null {
    const selectors: Record<string, string> = {
      header: '[class*="bg-wa-primary"], header',
      chat: '[class*="bg-wa-bg-chat"]',
      bubble: '[class*="bg-wa-bubble"]',
      input: 'textarea, input[type="text"]',
      message: '[class*="message"], [class*="bubble"]',
    };

    const selector = selectors[role];
    return selector ? container.querySelector(selector) : null;
  }

  /**
   * Obtém cor relevante para o elemento
   */
  private getRelevantColor(
    style: CSSStyleDeclaration,
    elementKey: string
  ): string {
    if (elementKey.includes('bg') || elementKey.includes('bubble')) {
      return this.rgbToHex(style.backgroundColor);
    }
    return this.rgbToHex(style.color);
  }

  /**
   * Obtém valor de layout para validação
   */
  private getLayoutValue(element: HTMLElement, layoutKey: string): number {
    const rect = element.getBoundingClientRect();

    switch (layoutKey) {
      case 'header-height':
        return rect.height;
      case 'bubble-max-width': {
        const parentWidth =
          element.parentElement?.getBoundingClientRect().width || 1;
        return (rect.width / parentWidth) * 100;
      }
      case 'input-padding':
        return parseInt(getComputedStyle(element).padding) || 0;
      case 'message-spacing':
        return parseInt(getComputedStyle(element).marginBottom) || 0;
      default:
        return 0;
    }
  }

  /**
   * Tolerância para validações de layout
   */
  private getLayoutTolerance(layoutKey: string): number {
    switch (layoutKey) {
      case 'header-height':
        return 2; // 2px tolerance
      case 'bubble-max-width':
        return 5; // 5% tolerance
      default:
        return 1;
    }
  }

  /**
   * Calcula diferença percentual entre cores
   */
  private calculateColorDifference(expected: string, actual: string): number {
    const expectedRgb = this.hexToRgb(expected);
    const actualRgb = this.hexToRgb(actual);

    if (!expectedRgb || !actualRgb) return 100;

    const rDiff = Math.abs(expectedRgb.r - actualRgb.r) / 255;
    const gDiff = Math.abs(expectedRgb.g - actualRgb.g) / 255;
    const bDiff = Math.abs(expectedRgb.b - actualRgb.b) / 255;

    return ((rDiff + gDiff + bDiff) / 3) * 100;
  }

  /**
   * Converte hex para RGB
   */
  private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  /**
   * Converte RGB para hex
   */
  private rgbToHex(rgb: string): string {
    const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!match) return '#000000';

    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);

    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }
}

/**
 * Função utilitária para validação rápida
 */
export const validateWhatsAppVisuals = async (
  container: HTMLElement
): Promise<VisualValidationResult> => {
  const validator = new WhatsAppVisualValidator();
  return validator.validateInterface(container);
};

/**
 * Hook React para validação visual automática
 */
export const useVisualValidation = (
  containerRef: React.RefObject<HTMLElement>
) => {
  const [result, setResult] = React.useState<VisualValidationResult | null>(
    null
  );
  const [isValidating, setIsValidating] = React.useState(false);

  const validate = React.useCallback(async () => {
    if (!containerRef.current) return;

    setIsValidating(true);
    try {
      const validationResult = await validateWhatsAppVisuals(
        containerRef.current
      );
      setResult(validationResult);
    } catch (error) {
      console.error('Erro na validação visual:', error);
    } finally {
      setIsValidating(false);
    }
  }, [containerRef]);

  React.useEffect(() => {
    // Validar automaticamente após mudanças no DOM
    const observer = new MutationObserver(() => {
      setTimeout(validate, 100); // Debounce
    });

    if (containerRef.current) {
      observer.observe(containerRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
      });
    }

    return () => observer.disconnect();
  }, [validate, containerRef]);

  return { result, isValidating, validate };
};
