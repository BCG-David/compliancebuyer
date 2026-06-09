import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Compliance Check — what does my UK business actually need?',
  description:
    'Answer 6 questions and find out which UK compliance areas apply to your business — fire, electrical, gas, water, asbestos, training. With priority and cost estimates.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
