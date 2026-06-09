interface EditorialCreditProps {
  lastUpdated: string;
}

/**
 * Editorial credit component per BCG brand spec section 8.
 * Appears at the head of every plain-English page.
 */
export function EditorialCredit({ lastUpdated }: EditorialCreditProps) {
  const formattedDate = new Date(lastUpdated).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <p className="editorial-credit mb-8">
      Reviewed by qualified compliance practitioners
      <span className="mx-2">·</span>
      Last updated {formattedDate}
    </p>
  );
}

/**
 * Disclaimer block per BCG brand spec section 8.
 * Appears at the foot of every plain-English page.
 */
export function PlainEnglishDisclaimer() {
  return (
    <p
      className="text-sm text-stone leading-relaxed border-t border-mist pt-6 mt-12"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      This guide provides general information about UK compliance requirements. It is not legal or
      professional advice. For your specific situation, consult a qualified professional.
    </p>
  );
}
