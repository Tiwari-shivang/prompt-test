import { atom } from 'recoil'

export const resetAddMemberState = atom({
    key:"resetAddMember",
    default:false
})

export const resetAddProjectState = atom({
    key:"resetProject",
    default:false
})

export const resetAddClientState = atom({
    key:"resetClient",
    default:false
})

export const resetAddTeamMemberState = atom({
    key:"resetTeamMember",
    default:false
})
