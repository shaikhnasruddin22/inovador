'use strict';

const fs = require('fs');
const path = require('path');

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
      // 1. Setup Public Role Permissions for read-only content and secure inquiry creation
      const publicRole = await strapi
        .query('plugin::users-permissions.role')
        .findOne({ where: { type: 'public' } });

      if (publicRole) {
        const publicPermissions = [
          'api::project.project.find',
          'api::project.project.findOne',
          'api::testimonial.testimonial.find',
          'api::testimonial.testimonial.findOne',
          'api::service.service.find',
          'api::service.service.findOne',
          'api::faq.faq.find',
          'api::faq.faq.findOne',
          'api::hero-slide.hero-slide.find',
          'api::hero-slide.hero-slide.findOne',
          'api::process-step.process-step.find',
          'api::process-step.process-step.findOne',
          'api::award-press.award-press.find',
          'api::award-press.award-press.findOne',
          'api::studio-about.studio-about.find',
          'api::studio-about.studio-about.findOne',
          'api::inquiry.inquiry.create', // Only CREATE allowed; find/findOne remain 403
        ];

        for (const action of publicPermissions) {
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

      // 2. Seed Projects
      const projectCount = await strapi.db.query('api::project.project').count();
      if (projectCount === 0) {
        const projectsFile = path.join(frontendDataDir, 'projects.json');
        if (fs.existsSync(projectsFile)) {
          const projectsData = JSON.parse(fs.readFileSync(projectsFile, 'utf8'));
          for (const item of projectsData) {
            await strapi.db.query('api::project.project').create({
              data: {
                title: item.title,
                slug: item.slug,
                city: item.city,
                category: item.category,
                year: item.year,
                shortDescription: item.shortDescription,
                description: item.fullDescription,
                featured: item.featured ?? false,
                sortOrder: item.sortOrder ?? 0,
                stats: item.stats ?? {},
                publishedAt: new Date(),
              },
            });
          }
          strapi.log.info(`Seeded ${projectsData.length} projects.`);
        }
      }

      // 3. Seed Testimonials
      const testimonialCount = await strapi.db.query('api::testimonial.testimonial').count();
      if (testimonialCount === 0) {
        const testimonialsFile = path.join(frontendDataDir, 'testimonials.json');
        if (fs.existsSync(testimonialsFile)) {
          const testimonialsData = JSON.parse(fs.readFileSync(testimonialsFile, 'utf8'));
          for (const item of testimonialsData) {
            await strapi.db.query('api::testimonial.testimonial').create({
              data: {
                clientName: item.clientName,
                quote: item.quote,
                roleOrLocation: item.roleOrLocation,
                sortOrder: item.sortOrder ?? 0,
                publishedAt: new Date(),
              },
            });
          }
          strapi.log.info(`Seeded ${testimonialsData.length} testimonials.`);
        }
      }

      // 4. Seed Services
      const serviceCount = await strapi.db.query('api::service.service').count();
      if (serviceCount === 0) {
        const servicesFile = path.join(frontendDataDir, 'services.json');
        if (fs.existsSync(servicesFile)) {
          const servicesData = JSON.parse(fs.readFileSync(servicesFile, 'utf8'));
          for (const item of servicesData) {
            await strapi.db.query('api::service.service').create({
              data: {
                name: item.name,
                slug: item.slug,
                iconName: item.iconName,
                shortDescription: item.shortDescription,
                deliverables: item.deliverables,
                sortOrder: item.sortOrder ?? 0,
                publishedAt: new Date(),
              },
            });
          }
          strapi.log.info(`Seeded ${servicesData.length} services.`);
        }
      }

      // 5. Seed FAQs
      const faqCount = await strapi.db.query('api::faq.faq').count();
      if (faqCount === 0) {
        const faqFile = path.join(frontendDataDir, 'faq.json');
        if (fs.existsSync(faqFile)) {
          const faqData = JSON.parse(fs.readFileSync(faqFile, 'utf8'));
          for (const item of faqData) {
            await strapi.db.query('api::faq.faq').create({
              data: {
                question: item.question,
                answer: item.answer,
                category: item.category ?? 'General',
                sortOrder: item.sortOrder ?? 0,
                publishedAt: new Date(),
              },
            });
          }
          strapi.log.info(`Seeded ${faqData.length} FAQs.`);
        }
      }

      // 6. Seed Hero Slides
      const heroSlideCount = await strapi.db.query('api::hero-slide.hero-slide').count();
      if (heroSlideCount === 0) {
        const heroSlides = [
          {
            title: 'Architecture in Dialogue with Landscape & Sea',
            eyebrow: 'Private Coastal Residence',
            location: 'Anjuna, Goa',
            projectSlug: 'the-raw-stone-pavilion',
            imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000&auto=format&fit=crop',
            sortOrder: 1,
            active: true,
          },
          {
            title: 'Art Deco Proportions & Tactile Travertine Marble',
            eyebrow: 'Heritage Interior Architecture',
            location: 'Marine Drive, Mumbai',
            projectSlug: 'apartment-702-marine-drive',
            imageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2000&auto=format&fit=crop',
            sortOrder: 2,
            active: true,
          },
          {
            title: 'Monolithic Concrete & Shaded Spatial Flow',
            eyebrow: 'Monolithic Courtyard Estate',
            location: 'Awas, Alibaug',
            projectSlug: 'courtyard-house-of-light',
            imageUrl: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2000&auto=format&fit=crop',
            sortOrder: 3,
            active: true,
          },
        ];
        for (const slide of heroSlides) {
          await strapi.db.query('api::hero-slide.hero-slide').create({
            data: {
              ...slide,
              publishedAt: new Date(),
            },
          });
        }
        strapi.log.info(`Seeded ${heroSlides.length} hero slides.`);
      }

      // 7. Seed Process Steps
      const processCount = await strapi.db.query('api::process-step.process-step').count();
      if (processCount === 0) {
        const processFile = path.join(frontendDataDir, 'process.json');
        if (fs.existsSync(processFile)) {
          const processData = JSON.parse(fs.readFileSync(processFile, 'utf8'));
          for (let i = 0; i < processData.length; i++) {
            const step = processData[i];
            await strapi.db.query('api::process-step.process-step').create({
              data: {
                stepNumber: step.number,
                title: step.title,
                subtitle: step.subtitle,
                description: step.description,
                sortOrder: i + 1,
                active: true,
                publishedAt: new Date(),
              },
            });
          }
          strapi.log.info(`Seeded ${processData.length} process steps.`);
        }
      }

      // 8. Seed Awards & Press
      const awardCount = await strapi.db.query('api::award-press.award-press').count();
      if (awardCount === 0) {
        const awardsFile = path.join(frontendDataDir, 'awards.json');
        if (fs.existsSync(awardsFile)) {
          const awardsData = JSON.parse(fs.readFileSync(awardsFile, 'utf8'));
          for (let i = 0; i < awardsData.length; i++) {
            const award = awardsData[i];
            await strapi.db.query('api::award-press.award-press').create({
              data: {
                title: award.title,
                publication: award.publication,
                year: award.year,
                badgeText: award.badgeText,
                sortOrder: i + 1,
                active: true,
                publishedAt: new Date(),
              },
            });
          }
          strapi.log.info(`Seeded ${awardsData.length} awards/press items.`);
        }
      }

      // 9. Seed Studio / About Single Type Record
      const studioAboutCount = await strapi.db.query('api::studio-about.studio-about').count();
      if (studioAboutCount === 0) {
        await strapi.db.query('api::studio-about.studio-about').create({
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
            publishedAt: new Date(),
          },
        });
        strapi.log.info('Seeded Studio / About single-type record.');
      }

      // 10. Seed Initial Test Inquiry (Private, internal verification)
      const inquiryCount = await strapi.db.query('api::inquiry.inquiry').count();
      if (inquiryCount === 0) {
        await strapi.db.query('api::inquiry.inquiry').create({
          data: {
            name: 'Dr. Siddharth & Radhika Singhania',
            email: 'patron@inovador-brief.example',
            phone: '+91 98200 12345',
            projectType: 'Architecture & Residential Villa',
            timeline: 'Within 6 Months',
            message: 'Looking to commission a 5,000 sq.ft cliffside residence in North Goa focusing on raw laterite and passive ventilation.',
            status: 'new',
          },
        });
        strapi.log.info('Seeded test inquiry brief for Studio Editor verification.');
      }

      strapi.log.info('Initial Strapi database seeding and schema configuration verified.');
    } catch (err) {
      strapi.log.error('Bootstrap initialization error: ', err);
    }
  },
};
