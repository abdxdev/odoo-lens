"use client";

import * as React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const formatRouteSegment = (segment: string): string => {
  if (segment === '') return 'Odoo Lens';
  const specialCases: Record<string, string> = {};
  if (specialCases[segment]) return specialCases[segment];
  return segment.split('-').map(
    word => word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

export function PageBreadcrumb() {
  const pathname = usePathname();

  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>{formatRouteSegment('')}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink asChild>
            <Link href="/">{formatRouteSegment('')}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden md:block" />

        {segments.map((segment, index) => {
          const path = `/${segments.slice(0, index + 1).join('/')}`;
          const isLast = index === segments.length - 1;
          const displayName = formatRouteSegment(segment);

          return (
            <React.Fragment key={path}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{displayName}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={path}>{displayName}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}