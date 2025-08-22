/**
 * Types para componente Avatar
 */

export interface AvatarProps {
  /** Nome para gerar iniciais caso não tenha imagem */
  name: string;
  /** URL da imagem do avatar */
  src?: string;
  /** Tamanho do avatar */
  size?: 'sm' | 'md' | 'lg';
  /** Classe CSS adicional */
  className?: string;
  /** Handler para clique no avatar */
  onClick?: () => void;
}
