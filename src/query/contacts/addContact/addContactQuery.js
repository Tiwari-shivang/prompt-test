import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { toaster } from '../../../utilits/toast'
import { addAllContacts, addContact } from './addContactApi'


export const useAddContact = () => {
    const navigate = useNavigate()
  return useMutation('addContact', addContact, {
    onSuccess: (res, variables, context) =>{
        toaster("success", "Successfully Added"); 
        navigate(-1)
    },
    onError: (error) =>{
        toaster("error", error.message);
    }
    })
}

export const useAddAllContacts = () => {
    return useMutation('addAllContacts', addAllContacts, {
      onSuccess: (res, variables, context) =>{
          toaster("success", "Successfully Added"); 
      },
      onError: (error) =>{
          toaster("error", error.message);
      }
      })
  }