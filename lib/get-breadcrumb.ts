export function getBreadcrumb(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  
  if (segments.length === 1) {
    return {
      title: 'Dashboard',
      items: []
    };
  }

  const items = segments.map((segment) => {
    const title = segment.charAt(0).toUpperCase() + segment.slice(1);
    return {
      title,
      href: `/${segments.slice(0, segments.indexOf(segment) + 1).join('/')}`
    };
  });

  return {
    title: items[items.length - 1].title,
    items: items.slice(0, -1)
  };
} 