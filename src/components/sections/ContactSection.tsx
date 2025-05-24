import { FC } from 'react';

/**
 * ContactSection displays a contact form or contact information.
 * @param translations - Translation object
 */
type ContactSectionProps = {
  translations: Record<string, string>;
};

const ContactSection: FC<ContactSectionProps> = ({ translations }) => {
  const t = (key: string) => translations[key] || key;
  return (
    <section className="py-16 scroll-mt-20" id="contact">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4 text-primary">{t('contactTitle')}</h2>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">{t('contactText')}</p>
        {/* TODO: Replace with real contact form */}
        <form className="flex flex-col gap-4 items-center">
          <input
            type="text"
            placeholder="Name"
            className="w-full max-w-md px-4 py-2 rounded border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full max-w-md px-4 py-2 rounded border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
          <textarea
            placeholder="Message"
            className="w-full max-w-md px-4 py-2 rounded border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
            rows={4}
            required
          />
          <button
            type="submit"
            className="px-6 py-2 bg-primary text-white rounded shadow hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactSection; 