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

      // 2. Automated Seed / Migration from mock JSON if tables are empty
      const projectCount = await strapi.db.query('api::project.project').count();

      if (projectCount === 0) {
        strapi.log.info('Seeding initial mock data into Strapi MySQL database...');

        const frontendDataDir = path.resolve(__dirname, '../../frontend/src/data');

        // Seed Projects
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

        // Seed Testimonials
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

        // Seed Services
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

        // Seed FAQs
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

        // Seed Initial Test Inquiry (Private, internal verification)
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

        strapi.log.info('Initial Strapi database seeding completed successfully.');
      }
    } catch (err) {
      strapi.log.error('Bootstrap initialization error: ', err);
    }
  },
};
