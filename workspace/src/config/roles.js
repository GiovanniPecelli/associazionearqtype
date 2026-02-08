export const ROLES = {
    // Executive Roles (English)
    PRESIDENT: 'president',
    SECRETARY: 'secretary',
    TREASURER: 'treasurer',
    COUNSELOR: 'counselor',

    // Technical mappings
    HOST: 'host',
    ARCHITECT: 'architect',
    TASKER: 'tasker',

    // Other known roles
    FOUNDER: 'founder',
    DEV: 'dev',
    HR: 'hr',
    MANAGEMENT: 'management',
    AGENT: 'agent',
    ADMIN: 'admin',
    OWNER: 'owner',
    HOST_ELITE: 'host elite'
};

export const ROLE_LABELS = {
    // Executive
    [ROLES.PRESIDENT]: 'President',
    [ROLES.SECRETARY]: 'Secretary',
    [ROLES.TREASURER]: 'Treasurer',
    [ROLES.COUNSELOR]: 'Counselor',

    // Mapped Roles
    [ROLES.ARCHITECT]: 'Coordinator',     // Replaces Architect
    [ROLES.TASKER]: 'Collaborator',       // Replaces Tasker
    [ROLES.HOST]: 'Counselor',            // Host maps to Counselor by default

    // Others
    [ROLES.FOUNDER]: 'Founder',
    [ROLES.DEV]: 'Developer',
    [ROLES.HR]: 'Human Resources',
    [ROLES.MANAGEMENT]: 'Management',
    [ROLES.AGENT]: 'Agent',
    [ROLES.ADMIN]: 'Administrator',
    [ROLES.OWNER]: 'Owner'
};

export const getRoleLabel = (role) => {
    if (!role) return '';
    const normalized = role.toLowerCase();

    // Try explicit match first, then normalized
    // This allows ROLE_LABELS keys to be either 'President' or 'president'
    // But since keys above are Title Case for executives, we need careful matching

    for (const key in ROLE_LABELS) {
        if (key.toLowerCase() === normalized) {
            return ROLE_LABELS[key];
        }
    }

    return role; // Fallback to raw role if no mapping found
};
