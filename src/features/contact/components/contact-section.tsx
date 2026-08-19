'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Profile } from '@/types/profile';
import { Container } from '@/components/layouts/container';
import { SectionHeader } from '@/components/layouts/section-header';
import { ContactForm } from '@/features/contact/components/contact-form';
import { SocialCard } from '@/features/contact/components/social-card';
import { useI18n } from '@/store/i18n-provider';

export interface ContactSectionProps {
  profile?: Profile;
}

export function ContactSection({ profile: initialProfile }: ContactSectionProps) {
  const { ui, profile: contextProfile } = useI18n();
  const profile = initialProfile || contextProfile;

  return (
    <section id="contact" className="py-20 sm:py-28 relative">
      <Container size="xl">
        <SectionHeader
          badge={ui.contactSection.badge}
          title={ui.contactSection.title}
          subtitle={ui.contactSection.subtitle}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7"
          >
            <ContactForm />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-5"
          >
            <SocialCard
              socials={profile.socials}
              email={profile.email}
              phone={profile.phone}
              location={profile.location}
              github={profile.github}
            />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
