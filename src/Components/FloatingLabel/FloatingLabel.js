import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import React from 'react';

const FormFloatingComponent = React.forwardRef(({controlId, label, className, placeholder, type}, ref) => {
  return (
    <>
    <Form>
      <FloatingLabel
          controlId={controlId}
          label={label}
          className={className}
          
        >
          <Form.Control type={type} placeholder={placeholder} ref={ref} />
      </FloatingLabel>
        
    </Form>
          
    </>
  );


}) 

export default FormFloatingComponent;