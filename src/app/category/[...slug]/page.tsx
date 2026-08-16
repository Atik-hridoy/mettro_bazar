'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { CATEGORY_TREE, CategoryItem } from '@/lib/constants';

// Helper to find a category and its breadcrumb path from the tree
function findCategoryPath(
  items: CategoryItem[],
  slugs: string[],
  currentPath: CategoryItem[] = []
): { target: CategoryItem | null; breadcrumbs: CategoryItem[] } {
  if (slugs.length === 0) {
    return { target: null, breadcrumbs: [] };
  }

  const currentSlug = slugs[0];
  const found = items.find(
    (item) =>
      item.slug === currentSlug ||
      item.id === currentSlug ||
      item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === currentSlug
  );

  if (!found) {
    return { target: null, breadcrumbs: [] };
  }

  const newPath = [...currentPath, found];

  if (slugs.length === 1) {
    return { target: found, breadcrumbs: newPath };
  }

  if (found.children && found.children.length > 0) {
    return findCategoryPath(found.children, slugs.slice(1), newPath);
  }

  return { target: found, breadcrumbs: newPath };
}

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const rawSlug = params?.slug;

  const slugArray: string[] = Array.isArray(rawSlug)
    ? rawSlug
    : typeof rawSlug === 'string'
    ? [rawSlug]
    : [];

  // Search in CATEGORY_TREE
  // If slug is a single subcategory like 'meat-and-fish', search top-level and second-level
  let { target, breadcrumbs } = findCategoryPath(CATEGORY_TREE, slugArray);

  // If not found at root, check inside root children (like Food)
  if (!target && slugArray.length === 1) {
    for (const root of CATEGORY_TREE) {
      if (root.children) {
        const sub = root.children.find(
          (c) => c.slug === slugArray[0] || c.id === slugArray[0]
        );
        if (sub) {
          target = sub;
          breadcrumbs = [root, sub];
          break;
        }
      }
    }
  }

  if (!target) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-lg font-semibold text-zinc-800 mb-2">Category Not Found</h2>
        <Link href="/" className="text-xs text-[#7533CB] font-bold hover:underline">
          Return to Home
        </Link>
      </div>
    );
  }

  const childCategories = target.children || [];

  return (
    <div className="w-full min-h-[calc(100vh-3.5rem)] bg-white px-4 sm:px-6 py-4">
      {/* 1. Breadcrumbs Header matching Chaldal */}
      <div className="flex items-center gap-1.5 text-xs text-zinc-600 mb-8 select-none">
        <Link href="/" className="hover:text-[#7533CB] hover:underline transition-colors">
          Home
        </Link>

        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;
          const subPath = breadcrumbs.slice(0, index + 1).map((b) => b.slug).join('/');

          return (
            <React.Fragment key={item.id}>
              <ChevronRight className="w-3 h-3 text-zinc-400" />
              {isLast ? (
                <span className="font-semibold text-zinc-900">{item.name}</span>
              ) : (
                <Link
                  href={`/category/${subPath}`}
                  className="hover:text-[#7533CB] hover:underline transition-colors"
                >
                  {item.name}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* 2. Child Categories Row / Grid matching Chaldal screenshots */}
      {childCategories.length > 0 ? (
        <div className="flex flex-wrap items-start gap-4 sm:gap-6 lg:gap-8 pb-12">
          {childCategories.map((child) => {
            const childHref = `/category/${[...slugArray, child.slug].join('/')}`;

            return (
              <div
                key={child.id}
                onClick={() => router.push(childHref)}
                className="group flex flex-col items-center w-32 sm:w-36 md:w-40 cursor-pointer select-none"
              >
                {/* Child Image Container */}
                <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 flex items-center justify-center p-2 rounded-xl group-hover:scale-105 transition-transform duration-200">
                  {child.image ? (
                    <img
                      src={child.image}
                      alt={child.name}
                      className="w-full h-full object-contain drop-shadow-xs"
                    />
                  ) : (
                    <div className="w-full h-full bg-zinc-100 rounded-lg flex items-center justify-center text-zinc-400 text-xs">
                      {child.name}
                    </div>
                  )}
                </div>

                {/* Child Name */}
                <span className="mt-2 text-xs sm:text-sm font-medium text-zinc-800 text-center leading-snug group-hover:text-[#7533CB] transition-colors line-clamp-2">
                  {child.name}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-16 text-center text-zinc-400 text-sm">
          No subcategories found for {target.name}.
        </div>
      )}
    </div>
  );
}
