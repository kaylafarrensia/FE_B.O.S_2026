import { cn } from '../../utils/index.js';

function Card({ className, children, ...props }) {
  return (
    <div className={cn('glassmorphism relative', className)} {...props}>
      {children}
    </div>
  );
}

export default Card;
