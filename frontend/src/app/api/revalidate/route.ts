import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(req: NextRequest) {
  try {
    const secret =
      req.headers.get('x-revalidate-secret') ||
      req.headers.get('authorization')?.replace('Bearer ', '') ||
      req.nextUrl.searchParams.get('secret');

    const expectedSecret = process.env.REVALIDATE_SECRET;

    if (!expectedSecret || expectedSecret === '<REVALIDATION_SECRET_KEY_PLACEHOLDER>') {
      // In local dev without secret, allow for developer verification
    } else if (secret !== expectedSecret) {
      return NextResponse.json({ error: 'Unauthorized: Invalid revalidation secret' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const model = body.model || body.event?.split('.')[0] || req.nextUrl.searchParams.get('model');
    const slug = body.entry?.slug || req.nextUrl.searchParams.get('slug');

    const revalidated: string[] = [];

    switch (model?.toLowerCase()) {
      case 'project':
        revalidateTag('projects', 'default');
        revalidatePath('/', 'page');
        revalidatePath('/#projects', 'page');
        revalidated.push('projects-tag', '/');
        if (slug) {
          revalidateTag(`project-${slug}`, 'default');
          revalidatePath(`/projects/${slug}`, 'page');
          revalidated.push(`project-${slug}`, `/projects/${slug}`);
        }
        break;

      case 'service':
        revalidateTag('services', 'default');
        revalidatePath('/', 'page');
        revalidated.push('services-tag', '/');
        break;

      case 'testimonial':
        revalidateTag('testimonials', 'default');
        revalidatePath('/', 'page');
        revalidated.push('testimonials-tag', '/');
        break;

      case 'faq':
        revalidateTag('faqs', 'default');
        revalidatePath('/', 'page');
        revalidated.push('faqs-tag', '/');
        break;

      default:
        revalidatePath('/', 'page');
        revalidateTag('projects', 'default');
        revalidateTag('services', 'default');
        revalidateTag('testimonials', 'default');
        revalidateTag('faqs', 'default');
        revalidated.push('all-tags', '/');
        break;
    }

    return NextResponse.json({
      revalidated: true,
      model: model || 'all',
      slug: slug || null,
      targets: revalidated,
      timestamp: Date.now(),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('[Revalidation Error]:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
