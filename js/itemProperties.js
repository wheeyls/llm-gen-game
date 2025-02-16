// Item properties that can combine to influence the narrative
export const ItemProperties = {
    // Cultural significance
    SACRED: 'sacred',
    CEREMONIAL: 'ceremonial',
    EVERYDAY: 'everyday',
    
    // Acquisition method (satirical)
    SUSPICIOUS: 'suspicious',
    DUBIOUS: 'dubious',
    LEGITIMATE: 'legitimate',
    
    // Time period
    ANCIENT: 'ancient',
    COLONIAL: 'colonial',
    MODERN: 'modern',
    
    // Cultural region
    EASTERN: 'eastern',
    WESTERN: 'western',
    INDIGENOUS: 'indigenous',
    
    // Item condition
    PRISTINE: 'pristine',
    DAMAGED: 'damaged',
    RESTORED: 'restored'
};

// Combinations that create special effects in transition
export const PropertyCombinations = {
    CULTURAL_CRISIS: [ItemProperties.SACRED, ItemProperties.SUSPICIOUS],
    RESTORATION_OPPORTUNITY: [ItemProperties.DAMAGED, ItemProperties.CEREMONIAL],
    HISTORICAL_RECKONING: [ItemProperties.COLONIAL, ItemProperties.INDIGENOUS],
    BUREAUCRATIC_NIGHTMARE: [ItemProperties.LEGITIMATE, ItemProperties.DUBIOUS],
    // Add more combinations as needed
};
