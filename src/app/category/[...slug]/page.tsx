'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ChevronRight, PackageX } from 'lucide-react';
import { CategoryItem, Product } from '@/lib/constants';
import { fetchCategoriesFromBackend, fetchProductsFromBackend } from '@/lib/api';
import { ProductCard } from '@/components/common/ProductCard';
import { Pagination } from '@/components/common/Pagination';

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

  const [categoriesTree, setCategoriesTree] = useState<CategoryItem[]>([]);
  const [backendProducts, setBackendProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [rawSlug]);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      const [fetchedTree, fetchedProds] = await Promise.all([
        fetchCategoriesFromBackend(),
        fetchProductsFromBackend(),
      ]);
      if (isMounted) {
        setCategoriesTree(fetchedTree || []);
        setBackendProducts(fetchedProds || []);
        setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const slugArray: string[] = Array.isArray(rawSlug)
    ? rawSlug
    : typeof rawSlug === 'string'
      ? [rawSlug]
      : [];

  let { target, breadcrumbs } = findCategoryPath(categoriesTree, slugArray);

  // Fallback search inside root children if slug was passed as single path
  if (!target && slugArray.length === 1 && categoriesTree.length > 0) {
    for (const root of categoriesTree) {
      if (root.children) {
        const sub = root.children.find(
          (c) => c.slug === slugArray[0] || c.id === slugArray[0]
        );
        if (sub) {
          target = sub;
          breadcrumbs = [root, sub];
          break;
        }
        for (const subItem of root.children) {
          if (subItem.children) {
            const leaf = subItem.children.find(
              (l) => l.slug === slugArray[0] || l.id === slugArray[0]
            );
            if (leaf) {
              target = leaf;
              breadcrumbs = [root, subItem, leaf];
              break;
            }
          }
        }
      }
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-center text-zinc-400 text-sm">
        Loading category data...
      </div>
    );
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
  const isLeafCategory = childCategories.length === 0;

  // Collect target category ID and all descendant category IDs/slugs
  const relevantIds = new Set<string>([String(target.id)]);
  const relevantSlugs = new Set<string>([target.slug]);

  const collectChildren = (item: CategoryItem) => {
    relevantIds.add(String(item.id));
    relevantSlugs.add(item.slug);
    if (item.children) {
      item.children.forEach(collectChildren);
    }
  };
  if (target.children) {
    target.children.forEach(collectChildren);
  }

  // Filter backend products matching category ID or category slug
  const categoryProducts = backendProducts.filter((p) => {
    if (p.categoryId && relevantIds.has(String(p.categoryId))) return true;
    if (p.categorySlug && relevantSlugs.has(p.categorySlug)) return true;
    if (p.category && (p.category.toLowerCase() === target?.name.toLowerCase() || p.category.toLowerCase().includes(target?.name.toLowerCase() || ''))) return true;
    return false;
  });

  return (
    <div className="w-full min-h-[calc(100vh-3.5rem)] bg-white px-4 sm:px-6 py-4">
      {/* 1. Breadcrumbs Header matching Chaldal */}
      <div className="flex items-center gap-1.5 text-xs text-zinc-600 mb-6 select-none flex-wrap">
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

      {/* 2. IF Category Has Children -> Render Child Subcategories Row */}
      {!isLeafCategory && (
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
      )}

      {/* 3. Render Products Grid for Category & Sub-Categories */}
      <div className="pb-16 pt-2">
        <div className="flex items-center justify-between mb-4 border-b border-zinc-100 pb-2">
          <h3 className="text-base font-bold text-zinc-900">
            Products in {target?.name} {categoryProducts.length > 0 && `(${categoryProducts.length})`}
          </h3>
        </div>

        {categoryProducts.length === 0 ? (
          <div className="py-12 text-center text-zinc-400 text-sm space-y-2 bg-zinc-50/50 rounded-2xl border border-zinc-100">
            <PackageX className="w-8 h-8 text-zinc-300 mx-auto" />
            <div>No products added to this category yet.</div>
            <div className="text-xs text-zinc-500">Create products under this category from Admin Dashboard!</div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3 sm:gap-4">
              {categoryProducts
                .slice((currentPage - 1) * 14, currentPage * 14)
                .map((prod: Product) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    categoryName={target?.name}
                  />
                ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(categoryProducts.length / 14)}
              totalItems={categoryProducts.length}
              itemsPerPage={14}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </div>
  );
}
