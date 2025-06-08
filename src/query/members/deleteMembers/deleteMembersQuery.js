import { useMutation, useQueryClient } from 'react-query'
import { toaster } from '../../../utilits/toast'
import { deleteHexaviewBuzz, deleteHexaviewBuzzComment, deleteMembers, deleteMenteeMentor, deleteTopPerformer } from './deleteMembersApi'


export const useDeleteMembers = () => {
    const cache = useQueryClient()
  return useMutation('deleteMembers', deleteMembers, {
    onSuccess: (res, variables, context) =>{
        toaster("success", "Successfully Deleted"); 
        cache.invalidateQueries("getAllMembers")
    },
    onError: (error) =>{
        toaster("error", error.message);
    }
    })
}

export const useDeleteMenteeMentor = () => {
    const cache = useQueryClient()
  return useMutation('deleteMenteeMentor', deleteMenteeMentor, {
    onSuccess: (res, variables, context) =>{
        toaster("success", "Successfully Deleted"); 
        cache.invalidateQueries("getAllMenteeMentor")
    },
    onError: (error) =>{
        toaster("error", error.message);
    }
    })
}

export const useDeleteTopPerformer = () => {
    const cache = useQueryClient()
  return useMutation('deleteTopPerformer', deleteTopPerformer, {
    onSuccess: (res, variables, context) =>{
        toaster("success", "Successfully Deleted"); 
        cache.invalidateQueries("getTopPerformer")
    },
    onError: (error) =>{
        toaster("error", error.message);
    }
    })
}

export const useDeleteHexaviewBuzz = () => {
    const cache = useQueryClient()
  return useMutation('deleteHexaviewBuzz', deleteHexaviewBuzz, {
    onSuccess: (res, variables, context) =>{
        toaster("success", "Successfully Deleted"); 
        cache.invalidateQueries("getHexaviewBuzz")
    },
    onError: (error) =>{
        toaster("error", error.message);
    }
    })
}

export const useDeleteHexaviewBuzzComment = () => {
    const cache = useQueryClient()
  return useMutation('deleteHexaviewBuzzComment', deleteHexaviewBuzzComment, {
    onSuccess: (res, variables, context) =>{
        toaster("success", "Comment successfully deleted "); 
        cache.invalidateQueries("getHexaviewBuzzCommentsAndLikes")
    },
    onError: (error) =>{
        toaster("error", error.message);
    }
    })
}

