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
        revalidatePath('/projects', 'page');
        revalidated.push('projects-tag', '/', '/projects');
        if (slug) {
          revalidateTag(`project-${slug}`, 'default');
          revalidatePath(`/projects/${slug}`, 'page');
          revalidated.push(`project-${slug}`, `/projects/${slug}`);
        }
        break;

      case 'service':
        revalidateTag('services', 'default');
        revalidatePath('/', 'page');
        revalidatePath('/services', 'page');
        revalidated.push('services-tag', '/', '/services');
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

      case 'hero-slide':
      case 'heroslide':
        revalidateTag('hero-slides', 'default');
        revalidatePath('/', 'page');
        revalidated.push('hero-slides-tag', '/');
        break;

      case 'process-step':
      case 'processstep':
        revalidateTag('process-steps', 'default');
        revalidatePath('/', 'page');
        revalidated.push('process-steps-tag', '/');
        break;

      case 'award-press':
      case 'awardpress':
        revalidateTag('awards-press', 'default');
        revalidatePath('/', 'page');
        revalidated.push('awards-press-tag', '/');
        break;

      case 'studio-about':
      case 'studioabout':
        revalidateTag('studio-about', 'default');
        revalidatePath('/', 'page');
        revalidatePath('/about', 'page');
        revalidated.push('studio-about-tag', '/', '/about');
        break;

      case 'navigation-item':
      case 'navigationitem':
      case 'navigation':
        revalidateTag('navigation', 'default');
        revalidatePath('/', 'layout');
        revalidated.push('navigation-tag', 'layout');
        break;

      case 'presence':
        revalidateTag('presence', 'default');
        revalidatePath('/presence', 'page');
        revalidated.push('presence-tag', '/presence');
        if (slug) {
          revalidateTag(`presence-${slug}`, 'default');
          revalidatePath(`/presence/${slug}`, 'page');
          revalidated.push(`presence-${slug}`, `/presence/${slug}`);
        }
        break;

      case 'page':
        revalidateTag('pages', 'default');
        revalidated.push('pages-tag');
        if (slug) {
          revalidateTag(`page-${slug}`, 'default');
          revalidatePath(`/${slug}`, 'page');
          revalidated.push(`page-${slug}`, `/${slug}`);
        }
        break;

      case 'site-setting':
      case 'sitesetting':
        revalidateTag('site-settings', 'default');
        revalidatePath('/', 'layout');
        revalidated.push('site-settings-tag', 'layout');
        break;

      case 'home-page':
      case 'homepage':
        revalidateTag('home-page', 'default');
        revalidatePath('/', 'page');
        revalidated.push('home-page-tag', '/');
        break;

      case 'services-page':
      case 'servicespage':
        revalidateTag('services-page', 'default');
        revalidatePath('/services', 'page');
        revalidated.push('services-page-tag', '/services');
        break;

      case 'projects-page':
      case 'projectspage':
        revalidateTag('projects-page', 'default');
        revalidatePath('/projects', 'page');
        revalidated.push('projects-page-tag', '/projects');
        break;

      case 'contact-page':
      case 'contactpage':
        revalidateTag('contact-page', 'default');
        revalidatePath('/contact', 'page');
        revalidated.push('contact-page-tag', '/contact');
        break;

      default:
        revalidatePath('/', 'layout');
        revalidateTag('projects', 'default');
        revalidateTag('services', 'default');
        revalidateTag('testimonials', 'default');
        revalidateTag('faqs', 'default');
        revalidateTag('hero-slides', 'default');
        revalidateTag('process-steps', 'default');
        revalidateTag('awards-press', 'default');
        revalidateTag('studio-about', 'default');
        revalidateTag('navigation', 'default');
        revalidateTag('presence', 'default');
        revalidateTag('pages', 'default');
        revalidateTag('site-settings', 'default');
        revalidateTag('home-page', 'default');
        revalidateTag('services-page', 'default');
        revalidateTag('projects-page', 'default');
        revalidateTag('contact-page', 'default');
        revalidated.push('all-tags', 'layout');
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
