import { useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';

function AlertComponent({heading, text, setAlert, variant}) {
  const [show, setShow] = useState(true);
  
  if (show) {
    return (
      <Alert variant={variant} onClose={() => {
        setShow(false);
        setAlert({
            needAlert: false,
            alertComponent: null
        })
        
      }} dismissible>
        <Alert.Heading>{heading}</Alert.Heading>
        <p>
          {text}
        </p>
      </Alert>
    );
  }
  
}

export default AlertComponent;