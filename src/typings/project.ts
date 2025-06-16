import { TBaseEntity } from './base';

export type TProjectStatus = 'active' | 'completed' | 'archived';
export type TProjectMemberRole = 'owner' | 'admin' | 'member';

export type TProject = TBaseEntity & {
    name: string;
    description: string | null;
    status: TProjectStatus;
    ownerId: string;
};

export type TProjectMember = TBaseEntity & {
    projectId: string;
    userId: string;
    role: TProjectMemberRole;
};

export type TCreateProjectData = {
    name: string;
    description?: string;
};

export type TUpdateProjectData = Partial<{
    name: string;
    description: string;
    status: TProjectStatus;
}>; 