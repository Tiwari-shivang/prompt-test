import {useMutation, useQuery} from "react-query";
import {createSkillCertificate, getAllBySkillUuid, getAllCertificatesByEmpUuid, getAllSkillWithCustomSkill, getEmpRatingByEmpUuid} from "./allEmployeeApi";
import {toaster} from "../../utilits/toast";

export const useGetEmpUuidListBySkillUuid = (skillUuid) => {
    return useQuery(["getAllBySkillUuid", skillUuid], () => getAllBySkillUuid(skillUuid), {
        enabled: skillUuid ? true : false,
        onError: (error) => {
            toaster("error", error.message);
        },
    });
};
export const useGetAllSkillWithCustomSkill = () => {
    return useQuery(["getAllSkillWithCustomSkill"], () => getAllSkillWithCustomSkill(), {
        onError: (error) => {
            toaster("error", error.message);
        },
    });
};
export const useGetAllCertificatesByEmpUuid = (empUuid) => {
    return useQuery(["getAllCertificatesByEmpUuid", empUuid], () => getAllCertificatesByEmpUuid(empUuid), {
        onError: (error) => {
            toaster("error", error.message);
        },
    });
};

export const useCreateSkillCertificate = () => {
    // const navigate = useNavigate();
    return useMutation("createSkillCertificate", createSkillCertificate, {
        onSuccess: (res, variables, context) => {
            toaster("success", "Successfully Added");
        },
        onError: (error) => {
            toaster("error", error.message);
        },
    });
};
export const useGetEmpRatingByEmpUuid = (empUuid) => {
    return useQuery(["getEmpRatingByEmpUuid", empUuid], () => getEmpRatingByEmpUuid(empUuid), {
        enabled: empUuid ? true : false,
        onError: (error) => {
            toaster("error", error.message);
        },
    });
};
