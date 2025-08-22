/**
 * Documentação e validação dos Design Tokens WhatsApp (wa-*)
 * Sistema de tokens para manter autenticidade visual
 */

/**
 * Definições oficiais dos tokens wa-*
 */
export const WhatsAppTokens = {
  colors: {
    // Cores principais da marca
    primary: {
      token: 'wa-primary',
      value: '#075E54',
      usage: 'Header principal, elementos de marca',
      category: 'brand',
    },
    secondary: {
      token: 'wa-secondary',
      value: '#128C7E',
      usage: 'Elementos secundários, avatars padrão',
      category: 'brand',
    },
    accent: {
      token: 'wa-accent',
      value: '#25D366',
      usage: 'Botões de ação, indicadores ativos',
      category: 'interactive',
    },

    // Backgrounds
    bg: {
      chat: {
        token: 'wa-bg-chat',
        value: '#E5DDD5',
        usage: 'Fundo principal da área de chat',
        category: 'background',
      },
      pattern: {
        token: 'wa-bg-pattern',
        value: '#F0F0F0',
        usage: 'Fundo da área de input e elementos secundários',
        category: 'background',
      },
    },

    // Bolhas de mensagem
    bubble: {
      sent: {
        token: 'wa-bubble-sent',
        value: '#DCF8C6',
        usage: 'Fundo das mensagens enviadas pelo usuário',
        category: 'message',
      },
      received: {
        token: 'wa-bubble-received',
        value: '#FFFFFF',
        usage: 'Fundo das mensagens recebidas',
        category: 'message',
      },
    },

    // Textos
    text: {
      primary: {
        token: 'wa-text-primary',
        value: '#000000',
        usage: 'Texto principal das mensagens e conteúdo',
        category: 'typography',
      },
      secondary: {
        token: 'wa-text-secondary',
        value: '#667781',
        usage: 'Texto secundário, placeholders',
        category: 'typography',
      },
      meta: {
        token: 'wa-text-meta',
        value: '#8696A0',
        usage: 'Timestamps, informações auxiliares',
        category: 'typography',
      },
    },

    // Indicadores de status
    check: {
      default: {
        token: 'wa-check-default',
        value: '#919191',
        usage: 'Checks de mensagem enviada/entregue',
        category: 'status',
      },
      read: {
        token: 'wa-check-read',
        value: '#4FC3F7',
        usage: 'Checks de mensagem lida',
        category: 'status',
      },
    },
  },

  spacing: {
    header: {
      token: 'h-15',
      value: '3.75rem', // 60px
      usage: 'Altura padrão do header do chat',
      category: 'layout',
    },
  },

  sizing: {
    bubble: {
      token: 'max-w-bubble',
      value: '65%',
      usage: 'Largura máxima das bolhas de mensagem',
      category: 'layout',
    },
  },
} as const;

/**
 * Categorias de tokens para organização
 */
export type TokenCategory =
  | 'brand'
  | 'interactive'
  | 'background'
  | 'message'
  | 'typography'
  | 'status'
  | 'layout';

/**
 * Interface para validação de tokens
 */
interface TokenValidation {
  token: string;
  isValid: boolean;
  currentValue: string;
  expectedValue: string;
  category: TokenCategory;
  usage: string;
}

/**
 * Classe para documentação e validação de tokens
 */
export class DesignTokenValidator {
  /**
   * Gera documentação completa dos tokens
   */
  generateDocumentation(): string {
    let doc = `# WhatsApp Design Tokens (wa-*)\n\n`;
    doc += `Tokens de design para manter autenticidade visual com WhatsApp real.\n\n`;

    const categories = this.groupTokensByCategory();

    for (const [category, tokens] of Object.entries(categories)) {
      doc += `## ${this.categoryTitle(category)}\n\n`;

      tokens.forEach((token) => {
        doc += `### \`${token.token}\`\n`;
        doc += `- **Valor:** \`${token.value}\`\n`;
        doc += `- **Uso:** ${token.usage}\n`;
        doc += `- **CSS:** \`class="${token.token}"\`\n\n`;
      });
    }

    doc += this.generateUsageExamples();
    doc += this.generateValidationGuide();

    return doc;
  }

  /**
   * Valida se os tokens estão sendo aplicados corretamente
   */
  validateTokens(element: HTMLElement): TokenValidation[] {
    const validations: TokenValidation[] = [];
    const computedStyle = getComputedStyle(element);

    // Validar cada token recursivamente
    this.validateTokensRecursively(
      WhatsAppTokens.colors,
      validations,
      element,
      computedStyle
    );

    return validations;
  }

  /**
   * Gera relatório de uso de tokens no projeto
   */
  generateUsageReport(rootElement: HTMLElement): Record<string, number> {
    const usage: Record<string, number> = {};
    const allTokens = this.getAllTokenNames();

    allTokens.forEach((token) => {
      const elements = rootElement.querySelectorAll(`[class*="${token}"]`);
      usage[token] = elements.length;
    });

    return usage;
  }

  /**
   * Verifica se há tokens não utilizados
   */
  findUnusedTokens(rootElement: HTMLElement): string[] {
    const usage = this.generateUsageReport(rootElement);
    return Object.entries(usage)
      .filter(([, count]) => count === 0)
      .map(([token]) => token);
  }

  private groupTokensByCategory(): Record<
    TokenCategory,
    Array<Record<string, unknown>>
  > {
    const categories: Record<TokenCategory, Array<Record<string, unknown>>> = {
      brand: [],
      interactive: [],
      background: [],
      message: [],
      typography: [],
      status: [],
      layout: [],
    };

    this.collectTokensRecursively(WhatsAppTokens.colors, categories);

    return categories;
  }

  private collectTokensRecursively(
    obj: Record<string, unknown>,
    categories: Record<TokenCategory, Array<Record<string, unknown>>>
  ): void {
    for (const [, value] of Object.entries(obj)) {
      if (
        value &&
        typeof value === 'object' &&
        'token' in value &&
        'category' in value
      ) {
        categories[value.category as TokenCategory].push(value);
      } else if (value && typeof value === 'object') {
        this.collectTokensRecursively(
          value as Record<string, unknown>,
          categories
        );
      }
    }
  }

  private validateTokensRecursively(
    obj: Record<string, unknown>,
    validations: TokenValidation[],
    element: HTMLElement,
    computedStyle: CSSStyleDeclaration
  ): void {
    for (const [, value] of Object.entries(obj)) {
      if (value && typeof value === 'object' && 'token' in value) {
        const validation = this.validateSingleToken(
          value,
          element,
          computedStyle
        );
        if (validation) {
          validations.push(validation);
        }
      } else if (value && typeof value === 'object') {
        this.validateTokensRecursively(
          value as Record<string, unknown>,
          validations,
          element,
          computedStyle
        );
      }
    }
  }

  private validateSingleToken(
    tokenDef: Record<string, unknown>,
    element: HTMLElement,
    computedStyle: CSSStyleDeclaration
  ): TokenValidation | null {
    const hasToken = element.className.includes(tokenDef.token as string);
    if (!hasToken) return null;

    // Determinar propriedade CSS a validar baseada no token
    let cssProperty = '';
    let currentValue = '';

    if ((tokenDef.token as string).includes('bg-')) {
      cssProperty = 'backgroundColor';
      currentValue = computedStyle.backgroundColor;
    } else if ((tokenDef.token as string).includes('text-')) {
      cssProperty = 'color';
      currentValue = computedStyle.color;
    } else if (
      (tokenDef.token as string).includes('w-') ||
      (tokenDef.token as string).includes('h-')
    ) {
      cssProperty = (tokenDef.token as string).includes('w-')
        ? 'width'
        : 'height';
      currentValue = computedStyle[
        cssProperty as keyof CSSStyleDeclaration
      ] as string;
    }

    const isValid = this.compareValues(
      currentValue,
      tokenDef.value as string,
      tokenDef.category as TokenCategory
    );

    return {
      token: tokenDef.token as string,
      isValid,
      currentValue,
      expectedValue: tokenDef.value as string,
      category: tokenDef.category as TokenCategory,
      usage: tokenDef.usage as string,
    };
  }

  private compareValues(
    current: string,
    expected: string,
    category: TokenCategory
  ): boolean {
    if (category === 'layout') {
      // Para dimensões, extrair valores numéricos
      const currentNum = parseFloat(current);
      const expectedNum = parseFloat(expected);
      return Math.abs(currentNum - expectedNum) < 2; // 2px tolerance
    }

    // Para cores, fazer comparação mais flexível
    if (current.startsWith('rgb')) {
      return this.compareColors(current, expected);
    }

    return current === expected;
  }

  private compareColors(rgbColor: string, hexColor: string): boolean {
    // Converter RGB para hex e comparar
    const rgbMatch = rgbColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (!rgbMatch) return false;

    const r = parseInt(rgbMatch[1]);
    const g = parseInt(rgbMatch[2]);
    const b = parseInt(rgbMatch[3]);

    const hexFromRgb = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;

    return hexFromRgb.toLowerCase() === hexColor.toLowerCase();
  }

  private getAllTokenNames(): string[] {
    const tokens: string[] = [];
    this.collectTokenNamesRecursively(WhatsAppTokens.colors, tokens);
    return tokens;
  }

  private collectTokenNamesRecursively(
    obj: Record<string, unknown>,
    tokens: string[]
  ): void {
    for (const [, value] of Object.entries(obj)) {
      if (value && typeof value === 'object' && 'token' in value) {
        tokens.push(value.token as string);
      } else if (value && typeof value === 'object') {
        this.collectTokenNamesRecursively(
          value as Record<string, unknown>,
          tokens
        );
      }
    }
  }

  private categoryTitle(category: string): string {
    const titles: Record<string, string> = {
      brand: 'Cores da Marca',
      interactive: 'Elementos Interativos',
      background: 'Backgrounds',
      message: 'Mensagens',
      typography: 'Tipografia',
      status: 'Indicadores de Status',
      layout: 'Layout e Espaçamento',
    };

    return titles[category] || category;
  }

  private generateUsageExamples(): string {
    return `
## Exemplos de Uso

### Componente MessageBubble
\`\`\`tsx
<div className={
  \`max-w-bubble p-3 rounded-lg \${
    message.sender === 'user' 
      ? 'bg-wa-bubble-sent' 
      : 'bg-wa-bubble-received'
  }\`
}>
  <p className="text-wa-text-primary">
    {message.text}
  </p>
  <span className="text-wa-text-meta text-xs">
    {formatTime(message.timestamp)}
  </span>
</div>
\`\`\`

### Header do Chat
\`\`\`tsx
<header className="bg-wa-primary text-white h-15 px-4">
  <h1 className="text-white">Chat Header</h1>
</header>
\`\`\`

### Status Checks
\`\`\`tsx
<svg className={
  \`w-4 h-4 \${
    message.status === 'read' 
      ? 'text-wa-check-read' 
      : 'text-wa-check-default'
  }\`
}>
  {/* SVG content */}
</svg>
\`\`\`

`;
  }

  private generateValidationGuide(): string {
    return `
## Validação de Tokens

### Validação Manual
Para validar se os tokens estão sendo aplicados corretamente:

1. **Cores**: Usar DevTools para verificar computed styles
2. **Layout**: Medir dimensões com régua do DevTools
3. **Responsividade**: Testar em diferentes viewports

### Validação Automática
\`\`\`tsx
import { DesignTokenValidator } from './design-tokens';

const validator = new DesignTokenValidator();
const validations = validator.validateTokens(chatContainer);
const unusedTokens = validator.findUnusedTokens(document.body);
\`\`\`

### Relatório de Uso
\`\`\`tsx
const usageReport = validator.generateUsageReport(document.body);
console.log('Token usage:', usageReport);
\`\`\`

## Troubleshooting

### Token não aplicado
- Verificar se o nome do token está correto
- Confirmar que Tailwind está compilando o token
- Checar especificidade CSS

### Cor diferente do esperado
- Verificar se não há CSS customizado sobrescrevendo
- Confirmar configuração do Tailwind
- Testar em modo incógnito para evitar extensões

### Layout quebrado
- Verificar responsive breakpoints
- Confirmar que tokens de spacing estão sendo aplicados
- Testar em diferentes navegadores
`;
  }
}

/**
 * Instância global do validador
 */
export const tokenValidator = new DesignTokenValidator();

/**
 * Função utilitária para gerar documentação
 */
export const generateTokenDocumentation = (): string => {
  return tokenValidator.generateDocumentation();
};
