export interface Guest {
    id: string;  // We'll generate this when converting CSV
    partyId: string;  // To group family members together
    totalInParty: number;
    title?: string;
    firstName: string;
    lastName: string;
    suffix?: string;
    partner?: {
      title?: string;
      firstName?: string;
      lastName?: string;
      suffix?: string;
    };
    address: {
      street1: string;
      street2?: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    children: Array<{
      firstName: string;
      lastName: string;
    }>;
    rsvp: {
      status?: 'yes' | 'no';
      totalAttending?: number;
      lastUpdated?: string;
      lastUpdatedBy?: 'guest' | 'admin';
    };
  }
