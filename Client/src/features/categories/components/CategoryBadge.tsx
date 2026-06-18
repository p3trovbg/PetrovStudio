import './CategoryBadge.css';

interface CategoryBadgeProps {
  name: string;
  onClick?: () => void;
  active?: boolean;
}

export default function CategoryBadge({ name, onClick, active = false }: CategoryBadgeProps) {
  return (
    <span
      className={`category-badge ${active ? 'category-badge-active' : ''} ${onClick ? 'category-badge-clickable' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {name}
    </span>
  );
}
