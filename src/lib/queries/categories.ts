import 'server-only';
import { supabase, isSupabaseConfigured, supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabase';
import { Category, SubCategory } from '@/shared/types';
import { INITIAL_CATEGORIES } from '@/shared/constants/initialData';

function getClient() {
  if (isSupabaseAdminConfigured() && supabaseAdmin) return supabaseAdmin;
  return supabase;
}

/**
 * Fetch all categories with their subcategories server-side.
 */
export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured()) {
    return INITIAL_CATEGORIES;
  }

  try {
    const client = getClient();
    const { data, error } = await client
      .from('categories')
      .select('id, name, slug, description, parent_id, created_at')
      .order('name');

    if (error || !data || data.length === 0) {
      return INITIAL_CATEGORIES;
    }

    type DbCategoryRow = {
      id: string;
      name: string;
      slug: string;
      description?: string | null;
      parent_id?: string | null;
    };
    const rows = data as DbCategoryRow[];
    const parentCats = rows.filter((c) => !c.parent_id);
    const subCats = rows.filter((c) => c.parent_id);

    return parentCats.map((parent) => ({
      id: parent.id,
      name: parent.name,
      slug: parent.slug,
      description: parent.description || undefined,
      subcategories: subCats
        .filter((sub) => sub.parent_id === parent.id)
        .map((sub): SubCategory => ({
          id: sub.id,
          name: sub.name,
          slug: sub.slug,
          categoryId: parent.id,
          description: sub.description || undefined,
        })),
    }));
  } catch (err) {
    console.warn('[getCategories error, falling back]:', err);
    return INITIAL_CATEGORIES;
  }
}

/**
 * Fetch single category by slug.
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await getCategories();
  return categories.find((c) => c.slug === slug) || null;
}
