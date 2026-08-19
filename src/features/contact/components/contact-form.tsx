'use client';

import * as React from 'react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { contactService } from '@/services/contact.service';
import { ContactFormInput } from '@/types/contact';
import { useI18n } from '@/store/i18n-provider';

export function ContactForm() {
  const { ui } = useI18n();

  const [formData, setFormData] = React.useState<ContactFormInput>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      setErrorMessage(ui.contactSection.requiredFieldsError);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      await contactService.sendMessage(formData);
      setIsSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch {
      setErrorMessage(ui.contactSection.errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 sm:p-8 border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/70 backdrop-blur-md">
      <div className="mb-6 space-y-1">
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          {ui.contactSection.formTitle}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {ui.contactSection.formSubtitle}
        </p>
      </div>

      {isSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center gap-3 text-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{ui.contactSection.successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 flex items-center gap-3 text-sm animate-in fade-in">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-mono">
              {ui.contactSection.nameLabel}
            </label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={ui.contactSection.namePlaceholder}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-mono">
              {ui.contactSection.emailLabel}
            </label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={ui.contactSection.emailPlaceholder}
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-mono">
            {ui.contactSection.subjectLabel}
          </label>
          <Input
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder={ui.contactSection.subjectPlaceholder}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-mono">
            {ui.contactSection.messageLabel}
          </label>
          <Textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            placeholder={ui.contactSection.messagePlaceholder}
            required
            disabled={isLoading}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full sm:w-auto"
          isLoading={isLoading}
          leftIcon={<Send className="w-4 h-4" />}
        >
          {isLoading ? ui.contactSection.sending : ui.contactSection.sendMessage}
        </Button>
      </form>
    </Card>
  );
}
