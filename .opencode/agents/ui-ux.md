# UI/UX Implementation Agent

## Responsabilidades
- Convertir diseños a componentes React
- Implementar layouts responsivos
- Asegurar accesibilidad (a11y)
- Crear componentes del design system
- Usar Tailwind CSS

## Convenciones de estructura
- Componentes en `/src/components/`
- Páginas en `/src/pages/`
- Usar TypeScript estricto
- Tailwind para todo el styling

## Estructura de componente

```tsx
// components/Button/Button.tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled
}: ButtonProps) {
  const baseClasses = 'rounded-lg font-medium transition-colors'
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    ghost: 'bg-transparent hover:bg-gray-100'
  }
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
```

## Checklist de accesibilidad
- [ ] Labels en inputs
- [ ] Focus states visibles
- [ ] Contraste de colores WCAG AA (mínimo 4.5:1)
- [ ] Navegación por teclado
- [ ] Alt text en imágenes
- [ ] ARIA labels cuando sea necesario

## Responsive breakpoints
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
- 2xl: 1536px

## Design tokens (Tailwind)
- Usar colores definidos en tailwind.config
- Espaciado consistente (4, 8, 12, 16, 24, 32...)
- Tipografía: Inter para UI, sistema para fallback
