import { revalidatePath } from 'next/cache';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabase';
import { withAdminRoute, ok, fail } from '@/lib/api/withAdminRoute';
import { generateEntityId } from '@/lib/ids';
import { INITIAL_CATEGORIES } from '@/shared/constants/initialData';

function revalidateCategoryPaths() {
  try {
    revalidatePath('/');
    revalidatePath('/products');
  } catch {
    // ignore outside Next runtime
  }
}

// GET: Fetch nested categories + subcategories
export const GET = withAdminRoute(
  { rateLimit: { key: 'adm_cat_get', limit: 120, windowSeconds: 60 }, requireServiceRole: false },
  async ({ auth }) => {
    if (!isSupabaseAdminConfigured() || !supabaseAdmin) {
      return ok({ data: INITIAL_CATEGORIES }, { newSession: auth.newSession });
    }

    const { data, error } = await supabaseAdmin
      .from('categories')
      .select('id, name, slug, description, parent_id, created_at')
      .order('name');

    if (error) {
      return fail(error.message, 500);
    }

    type CategoryRow = { id: string; name: string; slug: string; description?: string | null; parent_id?: string | null };
    const rows = (data || []) as CategoryRow[];
    if (rows.length === 0) {
      return ok({ data: INITIAL_CATEGORIES }, { newSession: auth.newSession });
    }

    const mains = rows.filter((c) => !c.parent_id);
    const subs = rows.filter((c) => Boolean(c.parent_id));

    const mapped = mains.map((main) => ({
      id: main.id,
      name: main.name,
      slug: main.slug,
      description: main.description || '',
      subcategories: subs
        .filter((s) => s.parent_id === main.id)
        .map((s) => ({
          id: s.id,
          name: s.name,
          slug: s.slug,
          categoryId: main.id,
        })),
    }));

    return ok({ data: mapped }, { newSession: auth.newSession });
  },
);

// POST: Create a new category or subcategory
export const POST = withAdminRoute(
  { rateLimit: { key: 'adm_cat_create', limit: 60, windowSeconds: 60 } },
  async ({ req, auth }) => {
    const body = await req.json();
    const { id, name, slug, description, parentId, subcategories } = body;

    if (!name || !name.trim()) {
      return fail('Tên danh mục không được để trống', 400);
    }

    const catId = id || generateEntityId('cat');
    const insertPayload = {
      id: catId,
      name: name.trim(),
      slug: slug || catId,
      description: description ? description.trim() : null,
      parent_id: parentId || null,
    };

    const { data, error } = await supabaseAdmin!
      .from('categories')
      .insert([insertPayload])
      .select()
      .single();

    if (error) {
      console.error('Supabase Category Insert Error:', error);
      return fail(error.message, 500);
    }

    // Insert subcategories if provided
    if (Array.isArray(subcategories) && subcategories.length > 0) {
      const subInserts = subcategories.map((sub: { id?: string; name?: string; slug?: string }) => ({
        id: sub.id || generateEntityId('sub'),
        name: sub.name?.trim() || 'Danh mục con',
        slug: sub.slug || generateEntityId('sub'),
        parent_id: catId,
      }));

      await supabaseAdmin!.from('categories').insert(subInserts);
    }

    revalidateCategoryPaths();
    return ok({ data }, { message: 'Tạo danh mục thành công', newSession: auth.newSession });
  },
);

// PATCH: Update category info or its subcategory list
export const PATCH = withAdminRoute(
  {},
  async ({ req, auth }) => {
    const body = await req.json();
    const { id, name, slug, description, subcategories } = body;

    if (!id) {
      return fail('Thiếu ID danh mục', 400);
    }

    const updatePayload: Record<string, unknown> = {};
    if (name !== undefined) updatePayload.name = name.trim();
    if (slug !== undefined) updatePayload.slug = slug;
    if (description !== undefined) updatePayload.description = description ? description.trim() : null;

    let updatedCat = null;
    if (Object.keys(updatePayload).length > 0) {
      const { data, error } = await supabaseAdmin!
        .from('categories')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Supabase Category Update Error:', error);
        return fail(error.message, 500);
      }
      updatedCat = data;
    }

    // Update the subcategory list if provided
    if (Array.isArray(subcategories)) {
      // 1. Fetch existing subcategories of this category
      const { data: existingSubs } = await supabaseAdmin!
        .from('categories')
        .select('id')
        .eq('parent_id', id);

      const existingIds = new Set((existingSubs || []).map((s) => s.id));
      const newIds = new Set(subcategories.map((s) => s.id));

      // 2. Delete subcategories no longer in the list
      const toDelete = Array.from(existingIds).filter((existingId) => !newIds.has(existingId));
      if (toDelete.length > 0) {
        await supabaseAdmin!.from('categories').delete().in('id', toDelete);
      }

      // 3. Upsert new or updated subcategories
      for (const sub of subcategories) {
        const subId = sub.id || generateEntityId('sub');
        await supabaseAdmin!.from('categories').upsert({
          id: subId,
          name: sub.name?.trim() || '',
          slug: sub.slug || subId,
          parent_id: id,
        });
      }
    }

    revalidateCategoryPaths();
    return ok({ data: updatedCat }, { message: 'Cập nhật danh mục thành công', newSession: auth.newSession });
  },
);

// DELETE: Remove a category (or subcategory)
export const DELETE = withAdminRoute(
  {},
  async ({ req, auth }) => {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return fail('Thiếu ID danh mục cần xóa', 400);
    }

    // Delete all subcategories of this category first, if any
    await supabaseAdmin!.from('categories').delete().eq('parent_id', id);

    // Delete the parent category
    const { error } = await supabaseAdmin!
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase Category Delete Error:', error);
      return fail(error.message, 500);
    }

    revalidateCategoryPaths();
    return ok({}, { message: 'Đã xóa danh mục thành công', newSession: auth.newSession });
  },
);
