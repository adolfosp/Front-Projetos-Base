import Icon from "./Icon";

interface CtaRootProps extends React.ComponentProps<'button'> {
    variant?: 'primary' | 'secondary';
    size?: 'small' | 'large';
  }
  
  export const CtaRoot: React.FC<CtaRootProps> = ({
    variant = 'primary',
    size = 'medium',
    className,
    children,
    ...props
  }) => {
    const classes = `btn ${variant} ${size} ${className}`;
  
    return (
      <button className={classes} {...props}>
        {children}
      </button>
    );
  };
  

  export const CtaIcon: React.FC<React.ComponentProps<typeof Icon>> = (props) => {
    return <Icon {...props} />;
  };
  
  export const CtaText: React.FC<React.ComponentProps<'span'>> = ({
    children,
    ...props
  }) => {
    return <span {...props}>{children}</span>;
  };
  
  export const Cta = {
    Root: CtaRoot,
    Icon: CtaIcon,
    Text: CtaText,
  };