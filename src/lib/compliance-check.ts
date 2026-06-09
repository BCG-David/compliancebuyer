// The 11 compliance topics covered by the site
export type ComplianceTopic =
  | 'health-safety-risk-assessment'
  | 'fire-risk-assessment'
  | 'fire-alarms'
  | 'fire-extinguishers'
  | 'emergency-lighting'
  | 'pat-testing'
  | 'electrical-testing'
  | 'gas-safety'
  | 'legionella'
  | 'asbestos'
  | 'workplace-safety-training';

export interface TopicResult {
  slug: ComplianceTopic;
  title: string;
  priority: 'critical' | 'required' | 'recommended' | 'situational';
  reason: string;
  estimatedCost: string;
}

export interface BusinessProfile {
  type: BusinessType;
  employeeCount: EmployeeCount;
  premisesAge: PremisesAge;
  ownership: Ownership;
  hasGas: boolean;
  hasWaterSystem: boolean;
  isResidential: boolean;
}

export type BusinessType =
  | 'office'
  | 'retail'
  | 'restaurant'
  | 'hotel'
  | 'warehouse'
  | 'manufacturing'
  | 'care-home'
  | 'school'
  | 'hmo-landlord'
  | 'residential-landlord'
  | 'construction'
  | 'other';

export type EmployeeCount = '1-4' | '5-19' | '20-49' | '50-249' | '250+';
export type PremisesAge = 'pre-2000' | 'post-2000' | 'unknown';
export type Ownership = 'own' | 'lease' | 'manage';

const TOPIC_TITLES: Record<ComplianceTopic, string> = {
  'health-safety-risk-assessment': 'Health & Safety Risk Assessment',
  'fire-risk-assessment': 'Fire Risk Assessment',
  'fire-alarms': 'Fire Alarm Systems',
  'fire-extinguishers': 'Fire Extinguishers',
  'emergency-lighting': 'Emergency Lighting',
  'pat-testing': 'PAT Testing',
  'electrical-testing': 'Electrical (EICR)',
  'gas-safety': 'Gas Safety',
  'legionella': 'Legionella Risk Assessment',
  'asbestos': 'Asbestos Management',
  'workplace-safety-training': 'Workplace Safety Training',
};

export function assessCompliance(profile: BusinessProfile): TopicResult[] {
  const results: TopicResult[] = [];

  // H&S Risk Assessment - applies to almost everyone with employees
  if (profile.employeeCount !== '1-4' || profile.type !== 'residential-landlord') {
    results.push({
      slug: 'health-safety-risk-assessment',
      title: TOPIC_TITLES['health-safety-risk-assessment'],
      priority: 'critical',
      reason: 'Required under MHSWR 1999 for any business with employees. The starting point for all other compliance.',
      estimatedCost: profile.employeeCount === '1-4' ? 'DIY or £200–£500' : '£300–£1,500',
    });
  }

  // Fire Risk Assessment - applies to all non-domestic premises and shared parts
  if (profile.type !== 'residential-landlord') {
    const isHigherRisk = ['hotel', 'care-home', 'school', 'hmo-landlord', 'restaurant'].includes(profile.type);
    results.push({
      slug: 'fire-risk-assessment',
      title: TOPIC_TITLES['fire-risk-assessment'],
      priority: 'critical',
      reason: isHigherRisk
        ? 'Required under RRO 2005. Sleeping risk and high-occupancy premises need higher-quality assessments.'
        : 'Required under RRO 2005 for all non-domestic premises and shared parts of residential buildings.',
      estimatedCost: isHigherRisk ? '£500–£3,000+' : '£200–£800',
    });
  }

  // Residential landlord with single property — limited FRA duty
  if (profile.type === 'residential-landlord') {
    results.push({
      slug: 'fire-risk-assessment',
      title: TOPIC_TITLES['fire-risk-assessment'],
      priority: 'situational',
      reason: 'Required for shared parts (entrance halls, stairwells) of multi-occupied residential buildings. Not required inside individual private flats.',
      estimatedCost: 'N/A unless shared parts',
    });
  }

  // Fire Alarms - required by FRA for almost all premises
  if (profile.type !== 'residential-landlord') {
    const isSimple = profile.type === 'office' && profile.employeeCount === '1-4';
    results.push({
      slug: 'fire-alarms',
      title: TOPIC_TITLES['fire-alarms'],
      priority: 'required',
      reason: isSimple
        ? 'Small premises may only need basic detection. Your FRA confirms the right system.'
        : 'Required for almost all workplaces. Type and category determined by FRA — BS 5839-1 sets the standard.',
      estimatedCost: isSimple ? '£500–£1,500 install' : '£2,000–£10,000+ install, £100–£400/yr service',
    });
  }

  // Fire Extinguishers - almost universal
  if (profile.type !== 'residential-landlord') {
    results.push({
      slug: 'fire-extinguishers',
      title: TOPIC_TITLES['fire-extinguishers'],
      priority: 'required',
      reason: 'Required under RRO 2005 for almost all premises. Number and type determined by FRA per BS 5306-8.',
      estimatedCost: '£40–£80 per extinguisher + £8–£15/yr service each',
    });
  }

  // Emergency Lighting - required where escape in dark could be needed
  if (profile.type !== 'residential-landlord') {
    results.push({
      slug: 'emergency-lighting',
      title: TOPIC_TITLES['emergency-lighting'],
      priority: 'required',
      reason: 'Required wherever people might need to escape in the dark. Standard for all non-domestic premises per BS 5266-1.',
      estimatedCost: '£500–£3,000 install, £200–£500/yr maintenance',
    });
  }

  // PAT Testing
  if (profile.type !== 'residential-landlord') {
    const tests = estimatePATVolume(profile);
    results.push({
      slug: 'pat-testing',
      title: TOPIC_TITLES['pat-testing'],
      priority: 'recommended',
      reason: `Not strictly required by law for commercial premises, but the simplest way to show appliances are safe. Estimated ${tests} items to test.`,
      estimatedCost: `~£${tests}–£${tests * 3} (£1–£3 per item)`,
    });
  }

  // EICR
  if (profile.type === 'residential-landlord' || profile.type === 'hmo-landlord') {
    results.push({
      slug: 'electrical-testing',
      title: TOPIC_TITLES['electrical-testing'],
      priority: 'critical',
      reason: 'Legally required for all rented homes in England every 5 years under the Electrical Safety Standards Regulations 2020.',
      estimatedCost: '£150–£400 per property',
    });
  } else {
    results.push({
      slug: 'electrical-testing',
      title: TOPIC_TITLES['electrical-testing'],
      priority: 'recommended',
      reason: 'Not directly mandated for commercial premises, but required by the Electricity at Work Regulations 1989 to keep installations safe. Standard interval: every 5 years.',
      estimatedCost: '£300–£2,000+ depending on size',
    });
  }

  // Gas Safety
  if (profile.hasGas) {
    if (profile.type === 'residential-landlord' || profile.type === 'hmo-landlord') {
      results.push({
        slug: 'gas-safety',
        title: TOPIC_TITLES['gas-safety'],
        priority: 'critical',
        reason: 'Annual landlord gas safety check legally required under GSIUR 1998. Certificate must be given to tenants within 28 days.',
        estimatedCost: '£60–£120 per property',
      });
    } else if (profile.type === 'restaurant' || profile.type === 'hotel') {
      results.push({
        slug: 'gas-safety',
        title: TOPIC_TITLES['gas-safety'],
        priority: 'critical',
        reason: 'Commercial gas (especially catering) is high-risk. Annual inspection by a Gas Safe engineer with commercial catering qualifications.',
        estimatedCost: '£200–£800 per inspection',
      });
    } else {
      results.push({
        slug: 'gas-safety',
        title: TOPIC_TITLES['gas-safety'],
        priority: 'required',
        reason: 'Required to keep gas installations safe under HSWA 1974. Annual Gas Safe inspection is the standard approach.',
        estimatedCost: '£100–£300 per inspection',
      });
    }
  }

  // Legionella
  if (profile.hasWaterSystem) {
    const isHigherRisk = ['care-home', 'hotel', 'hmo-landlord'].includes(profile.type);
    results.push({
      slug: 'legionella',
      title: TOPIC_TITLES['legionella'],
      priority: isHigherRisk ? 'critical' : 'required',
      reason: isHigherRisk
        ? 'Higher-risk premises (vulnerable occupants, sleeping risk) need rigorous legionella controls under L8 ACoP and HSG274.'
        : 'Required under HSWA 1974 and COSHH 2002. All workplaces with water systems need a legionella risk assessment.',
      estimatedCost: isHigherRisk ? '£300–£1,500 + ongoing monitoring' : '£100–£500 for assessment',
    });
  }

  // Asbestos
  if (profile.premisesAge === 'pre-2000' || profile.premisesAge === 'unknown') {
    results.push({
      slug: 'asbestos',
      title: TOPIC_TITLES['asbestos'],
      priority: 'required',
      reason: profile.premisesAge === 'unknown'
        ? 'If you don\'t know the age, treat as pre-2000 until you can confirm. Duty to manage asbestos applies under CAR 2012.'
        : 'Pre-2000 buildings are likely to contain asbestos. Duty to manage under CAR 2012 — survey and register required.',
      estimatedCost: '£250–£800 management survey, £500–£2,000 R&D survey',
    });
  }

  // Workplace Safety Training
  if (profile.employeeCount !== '1-4' || ['restaurant', 'manufacturing', 'construction', 'care-home'].includes(profile.type)) {
    results.push({
      slug: 'workplace-safety-training',
      title: TOPIC_TITLES['workplace-safety-training'],
      priority: 'required',
      reason: 'First aid and fire marshal training required for any business with employees. Specific roles may need more (manual handling, working at height).',
      estimatedCost: '£40–£400 per person depending on training type',
    });
  }

  // Sort by priority
  const priorityOrder = { critical: 0, required: 1, recommended: 2, situational: 3 };
  return results.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}

function estimatePATVolume(profile: BusinessProfile): number {
  const empMidpoint: Record<EmployeeCount, number> = {
    '1-4': 3,
    '5-19': 12,
    '20-49': 35,
    '50-249': 150,
    '250+': 400,
  };

  // Items per employee by industry — David's domain knowledge applied
  const itemsPerEmployee: Record<BusinessType, number> = {
    office: 5,           // laptop, charger, monitor, kettle share, etc.
    retail: 3,           // shop floor + back office
    restaurant: 8,       // kitchen + front of house equipment density
    hotel: 6,            // rooms + back of house
    warehouse: 2,        // mostly fixed equipment, some portable
    manufacturing: 4,    // mix of fixed and portable
    'care-home': 7,      // resident equipment, kitchen, communal
    school: 6,           // classrooms, IT, kitchen
    'hmo-landlord': 4,   // appliances per HMO unit
    'residential-landlord': 3,
    construction: 5,     // tools, site equipment
    other: 4,
  };

  return Math.round(empMidpoint[profile.employeeCount] * itemsPerEmployee[profile.type]);
}
