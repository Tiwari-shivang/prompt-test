import { toaster } from '../../../utilits/toast'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from 'react-query'
import { createTeamMember, createProject, createPhase, createProjectFromCSV } from './addProjectsApi'



export const useCreateTeamMember = () => {
    const navigate = useNavigate();
  return useMutation('createTeamMember', createTeamMember, {
    onSuccess: (res, variables, context) =>{
        toaster("success", "Successfully Added"); 
       // navigate(-1)
    },
    onError: (error) =>{
        toaster("error", error.message);
    }
    })
}

export const useCreateProject = () => {
    const navigate = useNavigate();
    return useMutation('createProject', createProject, {
      onSuccess: (res, variables, context) =>{
          toaster("success", "Successfully Added"); 
          navigate('/projects/allProject')
      },
      onError: (error) =>{
          toaster("error", error.message);
      }
      })
  }

export const useCreateProjectFromCSV = () => {
    const navigate = useNavigate();
    return useMutation('createProjectFromCSV', createProjectFromCSV, {
      onSuccess: (res, variables, context) =>{
        //   toaster("success", "Successfully Added");
      },
      onError: (error) =>{
        //   toaster("error", error.message);
      }
      })
  }

  export const useCreatePhase = () => {
    const navigate = useNavigate();
    return useMutation('createPhase', createPhase, {
      onSuccess: (res, variables, context) =>{
          toaster("success", "Successfully Added"); 
          navigate(-1)
      },
      onError: (error) =>{
          toaster("error", error.message);
      }
      })
  }