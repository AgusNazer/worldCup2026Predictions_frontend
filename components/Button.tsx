interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export default function Button({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  ...props 
}: ButtonProps) {
  const { variant: _variant, size: _size, ...buttonProps } = props as any
  
  return (
    <button style={getStyles(variant, size)} {...buttonProps}>
      {children}
    </button>
  )
}

function getStyles(variant: string, size: string): React.CSSProperties {
  const baseStyle: React.CSSProperties = {
    fontWeight: 600,
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    transition: 'all 150ms ease',
    cursor: 'pointer',
  }

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: '6px 12px', fontSize: '13px' },
    md: { padding: '8px 16px', fontSize: '14px' },
    lg: { padding: '12px 24px', fontSize: '15px' },
  }

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      background: 'linear-gradient(90deg, var(--color-accent-pink), var(--color-accent-cyan))',
      color: '#000',
    },
    secondary: {
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      color: 'var(--color-text)',
    },
    danger: {
      background: 'transparent',
      border: '1px solid var(--color-accent-pink)',
      color: 'var(--color-accent-pink)',
    },
  }

  return {
    ...baseStyle,
    ...(sizeStyles[size] || {}),
    ...(variantStyles[variant] || {}),
  }
}
