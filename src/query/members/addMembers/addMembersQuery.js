import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useSetRecoilState } from 'recoil'
import { resetAddMemberState } from '../../../recoil/resetFormRecoil'
import { toaster } from '../../../utilits/toast'
import {
    addAskForTraineeRating,
    addHexaviewBuzz,
    addHexaviewBuzzComment,
    addHexaviewBuzzCommentReact,
    addHexaviewBuzzReact,
    addHexaviewBuzzReplyOnComment,
    addMembers,
    addMembersFromCSV,
    addMembersInProjectPhase,
    addMenteeMentor,
    addTopPerformers,
    downloadMemberCSVFile,
} from './addMembersApi'
import { useNavigate } from 'react-router-dom'

export const useAddMembers = () => {
    const cache = useQueryClient()
    const setResetAddMemberState = useSetRecoilState(resetAddMemberState)
    return useMutation('addMembers', addMembers, {
        onSuccess: (res, variables, context) => {
            toaster('success', 'Successfully Added')
            cache.invalidateQueries('getAllMembers')
            setResetAddMemberState(true)
        },
        onError: (error) => {
            toaster('error', error.message)
        },
    })
}

export const useAddMembersFromCSV = () => {
    const navigate = useNavigate();
    return useMutation('addMembersFromCSV', addMembersFromCSV, {
      onSuccess: (res, variables, context) =>{
        //   toaster("success", "Successfully Added");
      },
      onError: (error) =>{
        //   toaster("error", error.message);
      }
      })
  }

  export const useMemberDownloadCSVFile = () => {
    return useQuery("downloadCsvFile", downloadMemberCSVFile, {
        onError: (error) =>{
          toaster("error", error.message);
        }
      });
  }

export const useAddMembersInProjectPhase = () => {
    const cache = useQueryClient()
    const navigate = useNavigate()
    const setResetAddMemberState = useSetRecoilState(resetAddMemberState)
    return useMutation('addMembersInProjectPhase', addMembersInProjectPhase, {
        onSuccess: (res, variables, context) => {
            toaster('success', 'Successfully Added')
            cache.invalidateQueries('addMembersInProjectPhase')
            setResetAddMemberState(true)
           // navigate(-1)
        },
        onError: (error) => {
            toaster('error', error.message)
        },
    })
}

export const useAddTopPerformers = () => {
    const cache = useQueryClient()
    return useMutation('addTopPerformers', addTopPerformers, {
        onSuccess: (res, variables, context) => {
            toaster('success', 'Successfully Added')
            cache.invalidateQueries('getTopPerformer')
        },
        onError: (error) => {
            toaster('error', error.message)
        },
    })
}

export const useAddMenteeMentor = () => {
    const cache = useQueryClient()
    return useMutation('addMenteeMentor', addMenteeMentor, {
        onSuccess: (res, variables, context) => {
            toaster('success', 'Successfully Added')
            cache.invalidateQueries('addMenteeMentor')
        },
        onError: (error) => {
            toaster('error', error.message)
        },
    })
}

export const useAddHexaviewBuzz = () => {
    const cache = useQueryClient()
    return useMutation('addHexaviewBuzz', addHexaviewBuzz, {
        onSuccess: (res, variables, context) => {
            toaster('success', 'Successfully Created')
            cache.invalidateQueries('getHexaviewBuzz')
        },
        onError: (error) => {
            toaster('error', error.message)
        },
    })
}

export const useAddHexaviewBuzzComment = () => {
    const cache = useQueryClient()
    return useMutation('addHexaviewBuzz', addHexaviewBuzzComment, {
        onSuccess: (res, variables, context) => {
            cache.invalidateQueries('getHexaviewBuzzCommentsAndLikes')
            toaster('success', 'Comment added.')
            // cache.invalidateQueries("addHexaviewBuzz")
        },
        onError: (error) => {
            toaster('error', error.message)
        },
    })
}

export const useAddHexaviewBuzzReplyOnComment = () => {
    const cache = useQueryClient()
    return useMutation('addHexaviewBuzzReplyOnComment', addHexaviewBuzzReplyOnComment, {
        onSuccess: (res, variables, context) => {
            cache.invalidateQueries('getHexaviewBuzzCommentsAndLikes')
            cache.invalidateQueries('getHexaviewBuzzAllRepliesOnComments')
            toaster('success', 'Reply added.')
        },
        onError: (error) => {
            toaster('error', error.message)
        },
    })
}

export const useAddHexaviewBuzzReact = () => {
    const cache = useQueryClient()
    return useMutation('addHexaviewBuzzReact', addHexaviewBuzzReact, {
        onSuccess: (res, variables, context) => {
            toaster('success', 'Reaction Added.')
            cache.invalidateQueries('getHexaviewBuzzCommentsAndLikes')
        },
        onError: (error) => {
            toaster('error', error.message)
        },
    })
}

export const useAddHexaviewBuzzCommentReact = () => {
    const cache = useQueryClient()
    return useMutation('addHexaviewBuzzCommentReact', addHexaviewBuzzCommentReact, {
        onSuccess: (res, variables, context) => {
            toaster('success', 'Reaction Added.')
            cache.invalidateQueries('getHexaviewBuzzCommentsAndLikes')
        },
        onError: (error) => {
            toaster('error', error.message)
        },
    })
}

export const useAddAskForTraineeRating = () => {
    const cache = useQueryClient()
    return useMutation('addAskForTraineeRating', addAskForTraineeRating, {
        onSuccess: (res, variables, context) => {
            toaster('success', 'Successfully Created')
        },
        onError: (error) => {
            toaster('error', error.message)
        },
    })
}
