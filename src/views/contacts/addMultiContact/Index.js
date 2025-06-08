import React, { useEffect } from 'react';
import { Button, Col, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumb from '../../../components/Breadcrumb';
import { useAddAllContacts } from '../../../query/contacts/addContact/addContactQuery';
import { useFieldArray, useForm } from 'react-hook-form';
import { requiredField } from '../../../utilits/validation';
import './style.scss';



const Index = () => {
  const params = useParams();
  const navigate = useNavigate()
  const {register, handleSubmit, errors, reset, control} = useForm({
    mode:"onTouched"
  });

  const {append, fields, remove} = useFieldArray({
    control,
    name:"contactForm",
  });

  // contact api 
  const { data, isLoading, mutateAsync} = useAddAllContacts()

  useEffect(() => {
    reset(data);
  }, [data]);



  const handleOnSubmit = (data) => {
    const newContactData = data?.contactForm?.map((item) => (
      {
        ...item,
      client_id: parseInt(params?.id),
      is_primary: true,
      profile_picture: "string"
      }
    ))
    mutateAsync(newContactData)
  }

  return (
    <div className='client-POC'>
      <Row className='mb-2'>
        <Col xs={6}>
          <Breadcrumb />
        </Col>
      </Row>



    {/* control section  */}
    <div className="addclient">
      <form onSubmit={handleSubmit(handleOnSubmit)}>
        {
          fields.map((item, index) => (
            <Row key={item.uuid}>
              <Col sm={10} className="mb-3">
                <Row>
              <Col sm={4} className="mb-3">
                <input 
                type="text" 
                placeholder="Name" 
                className="form-control"
                ref={register({
                  required : requiredField(),
                  })}
                name={`contactForm[${index}].name`}
                defaultValue={item.name}
                />
              </Col>
              <Col sm={4} className="mb-3">
                <input 
                type="text" 
                placeholder="Email" 
                className="form-control"
                ref={register({
                  required : requiredField(),
                  })}
                name={`contactForm[${index}].email`}
                defaultValue={item.email}
                />
              </Col>
              <Col sm={4} className="mb-3">
              <select
              className="form-control"
              ref={register({
                required : requiredField(),
              })}
              name={`contactForm[${index}].designation`}
              defaultValue={item?.designation}
              >
                <option value="">Select Designation</option>
                <option value="CEO">CTO</option>
                <option value="CEO">CFO</option>
                <option value="CEO">CEO</option>
              </select>
              </Col>
              <Col sm={4} className="mb-3">
                <input 
                type="text" 
                placeholder="Mobile Number" 
                className="form-control"
                ref={register({
                  required : requiredField(),
                  })}
                name={`contactForm[${index}].phone_number`}
                defaultValue={item.phone_number}
                />
              </Col>
              <Col sm={4} className="mb-3">
                <input 
                type="text" 
                placeholder="Country" 
                className="form-control"
                ref={register({
                  required : requiredField(),
                  })}
                name={`contactForm[${index}].country`}
                defaultValue={item.country}
                />
              </Col>
              <Col sm={4} className="mb-3">
                <input 
                type="text" 
                placeholder="Time Zone" 
                className="form-control"
                ref={register({
                  required : requiredField(),
                  })}
                name={`contactForm[${index}].time_zone`}
                defaultValue={item.time_zone}
                />
              </Col>
              </Row>
              </Col>
              <Col sm={2} className="mb-3">
              <Button variant="danger" style={{width:"100%"}} onClick={() => remove(index)}>Delete</Button>
            </Col>
          </Row>
         ))
        }
        <Row className="my-2">
          <Col sm={6}>
            { fields.length > 0 ?
                <div>
                  <Button variant="primary" type='submit'>Save contact</Button>
                <Button variant="outline-danger" onClick={()=>{navigate(-1)}}>
                  Cancel
                </Button>
                </div>
                :""
            }
          </Col>
          <Col sm={6} style={{textAlign:"right"}}>
            <Button variant="primary" onClick={() => append({
              name:"",
              email:"",
              designation:"",
              isPrimary:"",
              country:"",
              time_zone:""
            })}>Add More</Button>
          </Col>
        </Row>
      </form>
    </div>
    </div>    
  )
}

export default Index
