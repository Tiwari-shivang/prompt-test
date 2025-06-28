import React ,{useState} from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Row, Col, Button ,Modal} from 'react-bootstrap'
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import BootstrapTable from 'react-bootstrap-table-next'
import { CircularProgressbar } from 'react-circular-progressbar';
import Breadcrumb from '../../../components/Breadcrumb'
import { BiEdit } from 'react-icons/bi'
import { FaUserAlt } from 'react-icons/fa'
import { BsTrash } from 'react-icons/bs'
import { useGetClientContactProjectByClientId } from "../../../query/clients/allClients/allClientsQuery"
import { useGetAllProjectWithAssociatedEmployee } from "../../../query/projects/allProjects/allProjectsQuery"
import { useDeleteContact } from '../../../query/contacts/deleteContact/deleteContactQuery'
import avatar1 from '../../../assets/images/avatars/1.jpg'
import { BiEnvelope, BiPhoneCall, BiMaleSign, BiMap } from "react-icons/bi"
import './style.scss'
import { useGetClientContactsById } from '../../../query/clients/allClients/allClientsQuery';

const ClientDetail = () => {

  const [deleteModel, setDeleteModel] = useState(false)
  const [ ids, setIds] = useState("")
  const params = useParams();
  const navigate = useNavigate();

    const percentage = 66;

    // const {data, isLoading} = useGetClientContactProjectByClientId(params.id);
    const {data:projectWithEmp, isLoading:projectWithEmpIsLoading} = useGetAllProjectWithAssociatedEmployee({clientId:params.id});
    const {data, isLoading}=useGetClientContactsById(params.id)

    // const handleDeleteContact = (id) => {
    //     mutateAsync(id)
    // }

    const goToProjectDetail = (id) => {
        navigate(`/projects/projectDetail/${id}`)
    }
    const deleteContactHandler = (id) => {
      setIds(id)
      setDeleteModel(true,id)
    }

    const columns = [
        {
          dataField: '',
          text: 'Photos',
          formatter: (cellContent, row) => (
            <div className="departmentHead">
              <div className='headPic'>
               {
                    row && row.profile_picture ? <img src={row.profile_picture} alt=""/>  : <FaUserAlt className='userIcon'/> 
                }
              </div>
              {cellContent }
            </div>
          ),
        },
        {
          dataField: 'name',
          text: 'Name',
        },
        {
          dataField: 'email',
          text: 'Email',
        },
        {
          dataField: 'designation',
          text: 'Designation',
        },
        {
          dataField: 'country',
          text: 'Country',
        },
        {
          dataField: 'time_zone',
          text: 'Time Zone',
        },
        {
            dataField: 'phone_number',
            text: 'Mobile Number',
          },
        {
            dataField: '',
            text: 'Action',
            formatter: (cellContent, row) => (
              <div className="ActionIcon">
                <div className='icon'>
                    <Link to={`/contacts/updateContact/${row.contact_id}`}><BiEdit className='editIcon'/></Link>
                </div>
                <a className="deleteIcon" onClick={() => deleteContactHandler(row.contact_id)}>
          <BsTrash className='icon' />
        </a>
              </div>
            ),
          },
      ]



  return (
    <div className="clientDetail container">
            <Row className='mb-2'>
                <Col xs={6}>
                <Breadcrumb />
                </Col>
                <Col xs={6} className="">
                    
                </Col>
            </Row>
              <div className='memberDetailProfile'>
                <div className="clientCard container">
   
                    <Row>
                        <Col xs={6} lg={5} xl={4}>
                            <div className='ClientDetailRight container'>
                                <Row>
                                    <Col xs={6} lg={5}>
                                        <div className='clientPicOutside'>
                                            <div className='clientPic'>
                                                {
                                                    data && data.logo ? <img src={data.logo} alt=""/>  : <FaUserAlt className='userIcon'/> 
                                                }
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xs={6} lg={7}>
                                        <div className='clientInfo'>
                                            <h6 className='mb-2'>{data?.name}</h6>
                                            {/* <p>{data?.name}</p> */}
                                            {/* <p>Jerret Designer</p>
                                            <p>Employee Id : E0403</p> */}
                                            
                                        </div>
                                        <div className='contactDetail'>
                                          <div className='memberContact'>
                                              <p><BiPhoneCall className='icon'/> {data?.phone_number}</p>
                                              <p><BiEnvelope className='icon'/> {data?.web_url}</p>
                                              {/* <p><BiMaleSign className='icon'/> Male</p> */}
                                              <p><BiMap className='icon'/> {data?.country?.split('-')[1]}</p>
                                              <Button variant="primary">Message</Button>
                                          </div>
                                      </div>
                                    </Col>
                                </Row>
                            </div>
                        </Col >
                        <Col xs={6} lg={7} xl={8} className='ClientDetailLeft'>
                            <div className='description customScroll'>
                                <p>{data?.description}</p>
                            </div>
                        </Col>
                    </Row>
                </div>
              </div>


            <div className='contact-card-body'>
                <h2>Contacts</h2>
                <div className='main-card'>
                  {
                    data && data.contacts && data.contacts.length > 0 ?
                      <BootstrapTable
                      keyField="id"
                      data={data && data.contacts ? data.contacts : []}
                      columns={columns}
                      condensed
                      /> : <p>No contacts available.</p>
                  }
                </div>
                   <DeleteContactModal 
                deleteModalOpen={deleteModel}
                deleteModalClose={() => setDeleteModel(false)}
                deleteId = {ids}
            />
                <div className='addContactButton'>
                    <Button variant="primary">
                    <Link to={`/contacts/addContact/${params.id}`}>Add Contact</Link>
                    </Button>
                </div>
            </div>


              <div className='clientDetailCurrentProject container'>
              {projectWithEmp && projectWithEmp.total_project > 0 ? <h2>Current Project</h2>:<h2></h2> }
                    <Row className='px-2'>
                        {
                            projectWithEmp && projectWithEmp.project_with_employee && projectWithEmp.project_with_employee.map((item, index) =>(
                                <Col xs="12" md="6" lg="4" xl={3} key={index} className="px-2">
                                <div className='currentProject' onClick={() => goToProjectDetail(item?.project?.id)}>
                                    <div className='projectName'>{item?.project?.project_name}</div>
                                    <div className='progressPriority'>
                                        <span>{item?.phase ? "Inprogress" : "Completed"}</span>
                                        <p>Priority : {item?.project?.priority}</p>
                                    </div>
                                    <div className='projectDescription'>{item?.project?.description}</div>
                                    {/* <div className='projectCompletetion'> */}
                                        {/* <p>{item?.phase ? "Inprogress" : "Completed"}</p> */}
                                        {/* <div className='progessBar'>
                                        <CircularProgressbar value={percentage} text={`${percentage}%`} />
                                        </div> */}
                                    {/* </div> */}
                                    <div className='projectManager'>
                                        <p>Project Manager : <span>{item?.project_manager?.first_name} {item?.project_manager?.last_name}</span></p>
                                    </div>
                                    <div className='teamMember'>
                                        <p>Team Member</p>
                                        <div className='teamMembers'>
                                            {
                                              item?.employees?.slice(0, 5).map((empImg, index) => (
                                                <OverlayTrigger
                                                    placement="top"
                                                    delay={{ show: 250, hide: 400 }}
                                                    overlay={
                                                      <Tooltip id="button-tooltip">
                                                        {empImg?.first_name} {empImg?.last_name}
                                                      </Tooltip>
                                                    }
                                                  >
                                                      <div className='teamMembersPic'>
                                                          {
                                                              empImg && empImg?.profile_picture ? <img src={empImg.profile_picture} alt=""/>  : <FaUserAlt className='userIcon'/> 
                                                          }
                                                      </div>
                                                  </OverlayTrigger>
                                              ))
                                            }
                                            {
                                              item?.employees?.length > 5 && (
                                                <div className='hiddenTeamMembersPic'>
                                                  <p>+{item?.employees?.length - 5}</p>
                                                </div>
                                              )
                                            }
                                            
                                          </div>
                                    </div>
                                </div>  
                            </Col>
                            ))
                        }
                       </Row>
              </div>
    </div>
  )
}

export const DeleteContactModal = (props) => {
  const {deleteModalOpen, deleteModalClose, deleteId} = props
  const {error, isError, mutateAsync} = useDeleteContact();

  const contactHandler = (e)=>{
      e.preventDefault()
      const details = {
        id:deleteId,
      }
      mutateAsync(details.id)
      deleteModalClose()
  }
return (
  <>
  <Modal 
        className="commonModal" 
        show={deleteModalOpen} 
        onHide={deleteModalClose}
        centered
        >
      <Modal.Header closeButton >
        <Modal.Title>Delete Contact</Modal.Title>
      </Modal.Header>
      <Modal.Body className='container'>
          <Row className="my-3">
              <Col sm={12}>
              <p>Are you sure want to delete this contact ?</p>
              </Col>
          </Row>
          <Row className="mt-4 mb-2">
              <Col sm={12}>
                  <div className='buttonSection'>
                      <Button variant="primary" onClick={(e)=>contactHandler(e)}>
                      Yes
                      </Button>
                      <Button variant="outline-danger" onClick={deleteModalClose}>
                      Cancel
                      </Button>
                  </div>
              </Col>
          </Row>
      </Modal.Body>
    </Modal>
  </>
)
}

export default ClientDetail
