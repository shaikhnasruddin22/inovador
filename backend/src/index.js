'use strict';

const path = require('path');
const fs = require('fs');

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   */
  async bootstrap({ strapi }) {
    try {
      strapi.log.info('Running Inovador CMS bootstrap & permissions check...');

      // 1. Grant public READ permissions for all content endpoints
      const publicRole = await strapi
        .query('plugin::users-permissions.role')
        .findOne({ where: { type: 'public' } });

      if (publicRole) {
        const publicActions = [
          'api::project.project.find',
          'api::project.project.findOne',
          'api::service.service.find',
          'api::service.service.findOne',
          'api::testimonial.testimonial.find',
          'api::testimonial.testimonial.findOne',
          'api::faq.faq.find',
          'api::faq.faq.findOne',
          'api::hero-slide.hero-slide.find',
          'api::hero-slide.hero-slide.findOne',
          'api::process-step.process-step.find',
          'api::process-step.process-step.findOne',
          'api::award-press.award-press.find',
          'api::award-press.award-press.findOne',
          'api::studio-about.studio-about.find',
          'api::navigation-item.navigation-item.find',
          'api::navigation-item.navigation-item.findOne',
          'api::presence.presence.find',
          'api::presence.presence.findOne',
          'api::page.page.find',
          'api::page.page.findOne',
          'api::site-setting.site-setting.find',
          'api::home-page.home-page.find',
          'api::services-page.services-page.find',
          'api::projects-page.projects-page.find',
          'api::contact-page.contact-page.find',
          'api::inquiry.inquiry.create',
        ];

        for (const action of publicActions) {
          const existing = await strapi
            .query('plugin::users-permissions.permission')
            .findOne({
              where: {
                role: publicRole.id,
                action: action,
              },
            });

          if (!existing) {
            await strapi.query('plugin::users-permissions.permission').create({
              data: {
                role: publicRole.id,
                action: action,
                enabled: true,
              },
            });
          }
        }
      }

      const frontendDataDir = path.resolve(__dirname, '../../frontend/src/data');

      // 2. Seed / Repair Projects (Using Strapi v5 Document Service)
      const projectDrafts = await strapi.documents('api::project.project').findMany({ status: 'draft' });
      if (projectDrafts.length === 0) {
        const projectsFile = path.join(frontendDataDir, 'projects.json');
        if (fs.existsSync(projectsFile)) {
          const projectsData = JSON.parse(fs.readFileSync(projectsFile, 'utf8'));
          // Clear any obsolete raw unindexed rows
          await strapi.db.query('api::project.project').deleteMany({});
          for (const item of projectsData) {
            await strapi.documents('api::project.project').create({
              data: {
                title: item.title,
                slug: item.slug,
                city: item.city,
                category: item.category,
                year: item.year,
                shortDescription: item.shortDescription,
                description: item.fullDescription,
                coverImage: item.coverImage,
                gallery: item.gallery,
                beforeImage: item.beforeImage,
                afterImage: item.afterImage,
                featured: item.featured ?? false,
                sortOrder: item.sortOrder ?? 0,
                stats: item.stats ?? {},
              },
              status: 'published',
            });
          }
          strapi.log.info(`Seeded ${projectsData.length} projects via Document Service.`);
        }
      }

      // 3. Seed / Repair Testimonials (Using Strapi v5 Document Service)
      const testimonialDrafts = await strapi.documents('api::testimonial.testimonial').findMany({ status: 'draft' });
      if (testimonialDrafts.length === 0) {
        const testimonialsFile = path.join(frontendDataDir, 'testimonials.json');
        if (fs.existsSync(testimonialsFile)) {
          const testimonialsData = JSON.parse(fs.readFileSync(testimonialsFile, 'utf8'));
          await strapi.db.query('api::testimonial.testimonial').deleteMany({});
          for (const item of testimonialsData) {
            await strapi.documents('api::testimonial.testimonial').create({
              data: {
                clientName: item.clientName,
                quote: item.quote,
                roleOrLocation: item.roleOrLocation,
                projectReference: item.projectReference,
                photo: item.avatar,
                sortOrder: item.sortOrder ?? 0,
              },
              status: 'published',
            });
          }
          strapi.log.info(`Seeded ${testimonialsData.length} testimonials via Document Service.`);
        }
      }

      // 4. Seed / Repair Services (Using Strapi v5 Document Service)
      const serviceDrafts = await strapi.documents('api::service.service').findMany({ status: 'draft' });
      if (serviceDrafts.length === 0) {
        const servicesFile = path.join(frontendDataDir, 'services.json');
        if (fs.existsSync(servicesFile)) {
          const servicesData = JSON.parse(fs.readFileSync(servicesFile, 'utf8'));
          await strapi.db.query('api::service.service').deleteMany({});
          for (const item of servicesData) {
            await strapi.documents('api::service.service').create({
              data: {
                name: item.name,
                slug: item.slug,
                iconName: item.iconName,
                shortDescription: item.shortDescription,
                deliverables: item.deliverables,
                sortOrder: item.sortOrder ?? 0,
              },
              status: 'published',
            });
          }
          strapi.log.info(`Seeded ${servicesData.length} services via Document Service.`);
        }
      }

      // 5. Seed / Repair FAQs (Using Strapi v5 Document Service)
      const faqDrafts = await strapi.documents('api::faq.faq').findMany({ status: 'draft' });
      if (faqDrafts.length === 0) {
        const faqFile = path.join(frontendDataDir, 'faq.json');
        if (fs.existsSync(faqFile)) {
          const faqData = JSON.parse(fs.readFileSync(faqFile, 'utf8'));
          await strapi.db.query('api::faq.faq').deleteMany({});
          for (const item of faqData) {
            await strapi.documents('api::faq.faq').create({
              data: {
                question: item.question,
                answer: item.answer,
                category: item.category ?? 'General',
                sortOrder: item.sortOrder ?? 0,
              },
              status: 'published',
            });
          }
          strapi.log.info(`Seeded ${faqData.length} FAQs via Document Service.`);
        }
      }

      // 6. Seed / Repair Hero Slides (Using Strapi v5 Document Service)
      const heroSlideDrafts = await strapi.documents('api::hero-slide.hero-slide').findMany({ status: 'draft' });
      if (heroSlideDrafts.length === 0) {
        const heroSlides = [
          {
            title: 'Architecture in Dialogue with Landscape & Sea',
            eyebrow: 'Private Coastal Residence',
            location: 'Anjuna, Goa',
            projectSlug: 'the-raw-stone-pavilion',
            image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000&auto=format&fit=crop',
            sortOrder: 1,
            active: true,
          },
          {
            title: 'Art Deco Proportions & Tactile Travertine Marble',
            eyebrow: 'Heritage Interior Architecture',
            location: 'Marine Drive, Mumbai',
            projectSlug: 'apartment-702-marine-drive',
            image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2000&auto=format&fit=crop',
            sortOrder: 2,
            active: true,
          },
          {
            title: 'Monolithic Courtyard Estate',
            eyebrow: 'Monolithic Courtyard Estate',
            location: 'Awas, Alibaug',
            projectSlug: 'courtyard-house-of-light',
            image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2000&auto=format&fit=crop',
            sortOrder: 3,
            active: true,
          },
        ];
        await strapi.db.query('api::hero-slide.hero-slide').deleteMany({});
        for (const slide of heroSlides) {
          await strapi.documents('api::hero-slide.hero-slide').create({
            data: slide,
            status: 'published',
          });
        }
        strapi.log.info(`Seeded ${heroSlides.length} hero slides via Document Service.`);
      }

      // 7. Seed / Repair Process Steps (Using Strapi v5 Document Service)
      const processDrafts = await strapi.documents('api::process-step.process-step').findMany({ status: 'draft' });
      if (processDrafts.length === 0) {
        const processFile = path.join(frontendDataDir, 'process.json');
        if (fs.existsSync(processFile)) {
          const processData = JSON.parse(fs.readFileSync(processFile, 'utf8'));
          await strapi.db.query('api::process-step.process-step').deleteMany({});
          for (let i = 0; i < processData.length; i++) {
            const step = processData[i];
            await strapi.documents('api::process-step.process-step').create({
              data: {
                stepNumber: step.number,
                title: step.title,
                subtitle: step.subtitle,
                description: step.description,
                sortOrder: i + 1,
                active: true,
              },
              status: 'published',
            });
          }
          strapi.log.info(`Seeded ${processData.length} process steps via Document Service.`);
        }
      }

      // 8. Seed / Repair Awards & Press (Using Strapi v5 Document Service)
      const awardDrafts = await strapi.documents('api::award-press.award-press').findMany({ status: 'draft' });
      if (awardDrafts.length === 0) {
        const awardsFile = path.join(frontendDataDir, 'awards.json');
        if (fs.existsSync(awardsFile)) {
          const awardsData = JSON.parse(fs.readFileSync(awardsFile, 'utf8'));
          await strapi.db.query('api::award-press.award-press').deleteMany({});
          for (let i = 0; i < awardsData.length; i++) {
            const award = awardsData[i];
            await strapi.documents('api::award-press.award-press').create({
              data: {
                title: award.title,
                publication: award.publication,
                year: award.year,
                badgeText: award.badgeText,
                sortOrder: i + 1,
                active: true,
              },
              status: 'published',
            });
          }
          strapi.log.info(`Seeded ${awardsData.length} awards/press items via Document Service.`);
        }
      }

      // 9. Seed / Repair Studio / About Single Type (Using Strapi v5 Document Service)
      const studioAboutDrafts = await strapi.documents('api::studio-about.studio-about').findMany({ status: 'draft' });
      if (studioAboutDrafts.length === 0) {
        await strapi.db.query('api::studio-about.studio-about').deleteMany({});
        await strapi.documents('api::studio-about.studio-about').create({
          data: {
            studioName: 'Inovador Design Studio',
            tagline: 'Architecture · Interiors · Landscapes · Spatial Identities',
            statement: 'Sculpting timeless spatial sanctuaries through raw materiality, natural daylight, and contextual rigor.',
            email: 'studio@example.com',
            phone: '+91 98765 43210',
            mumbaiAddress: 'Design District, Kala Ghoda, Mumbai 400001',
            goaAddress: 'Studio Pavilion, Anjuna Coastal Road, Goa 403509',
            officeHours: 'Monday – Friday: 09:30 – 18:30 IST',
            weekendHours: 'Saturday: By Private Appointment',
            advisoryProtocol: 'Initial consultations are conducted either at our Mumbai/Goa drawing rooms or via private video conference for overseas patrons.',
            locations: ['Mumbai', 'Goa', 'Bengaluru', 'New Delhi', 'Alibaug'],
            socials: [
              { label: 'Instagram', href: 'https://instagram.com' },
              { label: 'LinkedIn', href: 'https://linkedin.com' },
              { label: 'Pinterest', href: 'https://pinterest.com' },
              { label: 'Architectural Digest', href: 'https://architecturaldigest.in' },
            ],
            heroHeadline: 'Sculpting sanctuaries through raw materiality & contextual rigor.',
            heroSubtitle: 'We are an interdisciplinary studio of architects, interior designers, and landscape planners dedicated to creating enduring spaces that celebrate the ritual of daily dwelling.',
            ethosEyebrow: 'The Inovador Ethos',
            ethosHeadline: 'Architecture grounded in material honesty & spatial stillness.',
            ethosDescription1: 'Founded in 2018, Inovador Design Studio is an architecture and spatial practice operating across Mumbai, Goa, Bengaluru, and Alibaug. We reject arbitrary decoration in favor of structural clarity, native masonry, and the tactile poetry of natural daylight.',
            ethosDescription2: 'Every project is approached as an ecological and cultural artifact—forged through deep collaboration with master craftsmen, stone masons, and local fabricators.',
            yearsExperience: 6,
            worksCount: 40,
            hubsCount: 5,
            pillars: [
              {
                title: 'Material Honesty & Structural Clarity',
                description: 'We let materials speak their natural dialect. Basalt stone remains textured, lime-plaster breathes with the seasons, and raw timber patinas gracefully over decades.',
              },
              {
                title: 'Contextual & Biophilic Architecture',
                description: 'Every building is an organic extension of its landscape. We study sun paths, monsoon wind corridors, and topography to craft passive microclimates that reduce ecological footprint.',
              },
              {
                title: 'Artisanal Craft & Millimeter Tolerances',
                description: 'We bridge architectural design with traditional master craftsmanship. Every joint, reveal, and bespoke brass fixture is engineered with couture precision.',
              },
              {
                title: 'Spatial Restraint & Quiet Luxury',
                description: 'We avoid transient trends and superfluous ornamentation. True luxury is found in generous proportions, rhythmic daylight, and spaces that invite quiet reflection.',
              },
            ],
            leadership: [
              {
                name: 'Aarav Mehta',
                role: 'Principal Architect & Founder',
                bio: 'Trained at the Architectural Association (AA London) and CEPT Ahmedabad, Aarav brings over 14 years of experience formulating monolithic residential villas and public pavilions across South Asia.',
                image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
              },
              {
                name: 'Rhea Sengupta',
                role: 'Director of Interior Architecture & Spatial Identity',
                bio: 'Specializing in heritage restoration and bespoke material curation, Rhea oversees all interior joinery, bespoke lighting engineering, and art advisory commissions at Inovador.',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
              },
            ],
            footerHeadline: "Let's formulate your next spatial sanctuary.",
            footerDescription: 'We lead residential architecture, private estates, and luxury interior transformations across India and select international locales.',
            ctaText: 'Start a Commission',
            ctaLink: '/#contact',
          },
          status: 'published',
        });
        strapi.log.info('Seeded Studio / About single-type record via Document Service.');
      }

      strapi.log.info('Inovador CMS Document Service initialization complete.');
    } catch (error) {
      strapi.log.error('Error during Strapi bootstrap:', error);
    }
  },
};
