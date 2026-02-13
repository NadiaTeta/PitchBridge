export type VerificationLevel = 'bronze' | 'silver' | 'gold';
export type UserRole = 'entrepreneur' | 'investor' | 'admin';

export interface UserDocument {
  id: string;
  type: 'nid' | 'tin' | 'rdb' | 'passport';
  status: 'pending' | 'approved' | 'rejected';
  uploadDate: string;
  azureUrl: string;
  fileName: string;
}

export interface UserProfileData {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  phone: string;
  bio: string;
  location: string;
  verificationLevel: VerificationLevel;
  verified: {
    nid: boolean;
    tin: boolean;
    rdb: boolean;
  };
  documents: UserDocument[];
  accountStatus: 'active' | 'suspended' | 'deactivated';
  createdDate: string;
  
  // Entrepreneur specific
  projects?: string[]; // Project IDs
  totalFundingRaised?: number;
  
  // Investor specific
  investmentHistory?: {
    projectId: string;
    projectName: string;
    amount: number;
    date: string;
  }[];
  preferredSectors?: string[];
  totalInvested?: number;
}

export const currentUser: UserProfileData = {
  id: 'user123',
  role: 'entrepreneur',
  name: 'Jean-Claude Mugabo',
  email: 'jc.mugabo@email.rw',
  phone: '+250 788 123 456',
  bio: 'Agricultural entrepreneur with 5 years experience in modern poultry farming. Passionate about sustainable farming practices.',
  location: 'Musanze',
  verificationLevel: 'gold',
  verified: {
    nid: true,
    tin: true,
    rdb: true,
  },
  documents: [
    {
      id: 'doc1',
      type: 'nid',
      status: 'approved',
      uploadDate: '2026-01-15',
      azureUrl: 'https://azure.blob.core.windows.net/docs/nid_123.pdf',
      fileName: 'national_id.pdf',
    },
    {
      id: 'doc2',
      type: 'tin',
      status: 'approved',
      uploadDate: '2026-01-16',
      azureUrl: 'https://azure.blob.core.windows.net/docs/tin_123.pdf',
      fileName: 'tin_certificate.pdf',
    },
    {
      id: 'doc3',
      type: 'rdb',
      status: 'approved',
      uploadDate: '2026-01-17',
      azureUrl: 'https://azure.blob.core.windows.net/docs/rdb_123.pdf',
      fileName: 'rdb_certificate.pdf',
    },
  ],
  accountStatus: 'active',
  createdDate: '2026-01-10',
  projects: ['1'],
  totalFundingRaised: 4500000,
};

export const mockInvestorProfile: UserProfileData = {
  id: 'investor456',
  role: 'investor',
  name: 'Sarah Uwamahoro',
  email: 'sarah.uwamahoro@email.rw',
  phone: '+250 788 456 789',
  bio: 'Impact investor focused on sustainable agriculture and technology startups in Rwanda. Looking for high-growth opportunities.',
  location: 'Kigali',
  verificationLevel: 'silver',
  verified: {
    nid: true,
    tin: true,
    rdb: false,
  },
  documents: [
    {
      id: 'doc4',
      type: 'nid',
      status: 'approved',
      uploadDate: '2026-01-12',
      azureUrl: 'https://azure.blob.core.windows.net/docs/nid_456.pdf',
      fileName: 'national_id.pdf',
    },
    {
      id: 'doc5',
      type: 'tin',
      status: 'approved',
      uploadDate: '2026-01-13',
      azureUrl: 'https://azure.blob.core.windows.net/docs/tin_456.pdf',
      fileName: 'tin_certificate.pdf',
    },
  ],
  accountStatus: 'active',
  createdDate: '2026-01-05',
  investmentHistory: [
    {
      projectId: '2',
      projectName: 'Mobile Payment Integration',
      amount: 10000000,
      date: '2026-01-18',
    },
  ],
  preferredSectors: ['agriculture', 'tech'],
  totalInvested: 10000000,
};

export const getVerificationBadge = (level: VerificationLevel) => {
  const badges = {
    bronze: {
      color: 'from-amber-600 to-amber-800',
      icon: '🥉',
      label: 'Bronze Verified',
      description: 'NID Verified',
    },
    silver: {
      color: 'from-gray-400 to-gray-600',
      icon: '🥈',
      label: 'Silver Verified',
      description: 'NID + TIN Verified',
    },
    gold: {
      color: 'from-yellow-400 to-yellow-600',
      icon: '🥇',
      label: 'Gold Verified',
      description: 'NID + TIN + RDB Verified',
    },
  };
  return badges[level];
};