import { atom } from 'recoil'

export const authState = atom({
    key:"authDetail",
    default:{}
})

export const authRoleState = atom({
    key:"authRole",
    default:{}
})

export const verifyEmail = atom({
    key:"verifyEmail",
    default:false
})
