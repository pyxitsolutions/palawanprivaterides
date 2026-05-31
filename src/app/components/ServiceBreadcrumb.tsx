import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { getServiceListPath } from '../utils/serviceHelpers';

interface ServiceBreadcrumbProps {
  type: string;
  serviceName: string;
}

export function ServiceBreadcrumb({ type, serviceName }: ServiceBreadcrumbProps) {
  const { href, label } = getServiceListPath(type);

  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm text-white/70 mb-4">
      <Link to="/" className="hover:text-white transition-colors">
        Home
      </Link>
      <ChevronRight size={14} className="opacity-60 shrink-0" />
      <Link to={href} className="hover:text-white transition-colors">
        {label}
      </Link>
      <ChevronRight size={14} className="opacity-60 shrink-0" />
      <span className="text-white font-semibold truncate max-w-[200px] sm:max-w-none">{serviceName}</span>
    </nav>
  );
}
